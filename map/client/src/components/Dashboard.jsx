import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import MapComponent from './MapComponent';
import UserTable from './UserTable';
import { getAllUsers, updateLocation, logout } from '../services/api';

const Dashboard = ({ user, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(user);
  const [locationPermission, setLocationPermission] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [watchId, setWatchId] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [locationDetails, setLocationDetails] = useState({
    coords: null,
    speed: null,
    heading: null,
    altitude: null
  });

  useEffect(() => {
    const socket = io('https://track-friends.onrender.com');

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('locationUpdate', (data) => {
      console.log('📍 Location update received:', data);
      fetchUsers();
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    requestLocationPermission();
    fetchUsers();

    // Auto refresh users every 30 seconds
    const usersRefreshInterval = setInterval(() => {
      fetchUsers();
      console.log('🔄 Auto-refreshing users...');
    }, 30000);

    // Auto update location every 5 minutes (300000ms)
    const locationUpdateInterval = setInterval(() => {
      if (navigator.geolocation && locationPermission) {
        console.log('⏰ 5-minute timer: Updating location...');
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log('🔄 Scheduled location update:', pos.coords);
            updateUserLocation(pos.coords.latitude, pos.coords.longitude);
          },
          (err) => {
            console.error('❌ Scheduled location update failed:', err);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
        );
      }
    }, 300000); // 5 minutes = 300000 milliseconds

    return () => {
      socket.disconnect();
      clearInterval(usersRefreshInterval);
      clearInterval(locationUpdateInterval);
      
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        console.log('🛑 Location tracking stopped');
      }
    };
  }, [locationPermission]);

  const requestLocationPermission = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(true);
          updateUserLocation(position.coords.latitude, position.coords.longitude);
          toast.success('🎯 Location tracking started! Updates every 5 minutes.');
          
          // Store location details for display only
          const accuracy = position.coords.accuracy;
          setLocationAccuracy(accuracy);
          
          setLocationDetails({
            coords: {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            },
            speed: position.coords.speed,
            heading: position.coords.heading,
            altitude: position.coords.altitude
          });
          
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('📍 INITIAL LOCATION');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
          console.log('🌐 Latitude:', position.coords.latitude);
          console.log('🌐 Longitude:', position.coords.longitude);
          console.log('🎯 Accuracy:', accuracy.toFixed(2), 'meters');
          console.log('⏰ Next update in 5 minutes');
          console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        },
        (error) => {
          setLocationPermission(false);
          if (error.code === 1) {
            toast.error('Location permission denied. Please enable it in browser settings.');
          } else if (error.code === 2) {
            toast.error('Location unavailable. Check GPS/network.');
          } else if (error.code === 3) {
            toast.error('Location request timeout.');
          }
          console.error('Location error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const updateUserLocation = async (latitude, longitude) => {
    try {
      console.log('🔄 Updating location in database...');
      console.log('📍 Coordinates:', latitude, longitude);
      
      const cityData = await getCityFromCoordinates(latitude, longitude);
      
      console.log('🏙️ City detected:', cityData.city);
      console.log('🗺️ Full address:', cityData.fullAddress);
      
      await updateLocation(latitude, longitude, cityData.city, cityData.state, cityData.country);
      
      setCurrentUser(prev => ({
        ...prev,
        location: { 
          latitude, 
          longitude,
          city: cityData.city,
          state: cityData.state,
          country: cityData.country,
          fullAddress: cityData.fullAddress
        }
      }));
      
      // Update location details for display
      setLocationDetails(prev => ({
        ...prev,
        coords: {
          lat: latitude,
          lng: longitude
        }
      }));
      
      setLastUpdate(new Date().toLocaleTimeString());
      toast.success(`✅ Location updated: ${cityData.city}`, {
        autoClose: 2000
      });
      
      console.log('✅ Location updated successfully in database');
      console.log('⏰ Next automatic update in 5 minutes');
    } catch (error) {
      console.error('❌ Failed to update location:', error);
      toast.error('Location update failed');
    }
  };

  const getCityFromCoordinates = async (lat, lon) => {
    try {
      console.log('🔍 Fetching address for:', lat, lon);
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'LocationTrackerApp/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
      
      const data = await response.json();
      console.log('🏠 Full Address Data:', data);
      console.log('📍 Display Name:', data.display_name);
      
      const addr = data.address || {};
      
      return {
        city: addr.city || addr.town || addr.village || addr.county || addr.state_district || 'Unknown',
        state: addr.state || addr.state_district || '',
        country: addr.country || '',
        fullAddress: data.display_name || 'Unknown location'
      };
    } catch (error) {
      console.error('❌ Geocoding error:', error);
      return { 
        city: 'Unknown', 
        state: '', 
        country: '',
        fullAddress: 'Location unavailable'
      };
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      if (response.success) {
        setUsers(response.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      toast.success('Logged out successfully');
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  };

  return (
    <div className="min-vh-100" style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      {/* Modern Navbar */}
      <nav className="shadow-sm" style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="container-fluid px-4 py-3">
          <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center justify-content-center rounded-circle" style={{
                width: '45px',
                height: '45px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" 
                        fill="white"/>
                </svg>
              </div>
              <span className="fw-bold text-white" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.3rem)' }}>
                7x Infotech Tracker
              </span>
            </div>
            
            <div className="d-flex align-items-center gap-3">
              {currentUser.profilePicture && (
                <img
                  src={currentUser.profilePicture}
                  alt={currentUser.name}
                  className="rounded-circle border border-2 border-white"
                  style={{ 
                    width: 'clamp(35px, 8vw, 45px)', 
                    height: 'clamp(35px, 8vw, 45px)',
                    objectFit: 'cover'
                  }}
                />
              )}
              <span className="text-white fw-semibold d-none d-md-inline" style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
                {currentUser.name}
              </span>
              <button 
                className="btn btn-light btn-sm px-3 py-2 fw-semibold"
                onClick={handleLogout}
                style={{
                  borderRadius: '10px',
                  fontSize: 'clamp(0.8rem, 2vw, 0.9rem)'
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid px-3 px-md-4 py-4">
        
        {/* Welcome Card */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              overflow: 'hidden'
            }}>
              {/* Decorative Top Bar */}
              <div style={{
                height: '6px',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 50%, #667eea 100%)',
                backgroundSize: '200% 100%',
                animation: 'gradientMove 3s ease infinite'
              }}></div>
              
              <div className="card-body p-3 p-md-4">
                {/* Header Section */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
                  <div>
                    <h4 className="mb-2 fw-bold" style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: 'clamp(1.3rem, 4vw, 1.75rem)'
                    }}>
                      Welcome back, {currentUser.name}! 👋
                    </h4>
                    <p className="text-muted mb-0" style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
                      📧 {currentUser.email}
                    </p>
                  </div>
                  
                  <div className="d-flex gap-2 flex-wrap">
                    <button 
                      className="btn btn-sm px-3 py-2 fw-semibold"
                      style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
                      }}
                      onClick={() => {
                        if (navigator.geolocation) {
                          toast.info('🔄 Getting fresh location...', { autoClose: 1500 });
                          navigator.geolocation.getCurrentPosition(
                            (pos) => {
                              console.log('🆕 Fresh location requested:', pos.coords);
                              updateUserLocation(pos.coords.latitude, pos.coords.longitude);
                            },
                            (err) => {
                              console.error('❌ Location error:', err);
                              toast.error('Failed to get location. Check permissions.');
                            },
                            { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
                          );
                        }
                      }}
                    >
                      📍 Update Location
                    </button>
                    <button 
                      className="btn btn-outline-primary btn-sm px-3 py-2 fw-semibold"
                      style={{
                        borderRadius: '12px',
                        fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                        borderWidth: '2px'
                      }}
                      onClick={() => {
                        fetchUsers();
                        toast.info('Refreshing users...', { autoClose: 1500 });
                      }}
                    >
                      🔄 Refresh
                    </button>
                  </div>
                </div>

                {/* Status Cards Grid */}
                <div className="row g-3 mb-4">
                  {/* Tracking Status */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <div className="p-3 rounded-3 h-100" style={{
                      background: locationPermission ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' : 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)',
                      color: 'white'
                    }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div style={{ fontSize: '1.5rem' }}>
                          {locationPermission ? '🟢' : '🔴'}
                        </div>
                        <span className="fw-semibold" style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
                          Tracking Status
                        </span>
                      </div>
                      <div className="fw-bold" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>
                        {locationPermission ? 'Live Active' : 'Inactive'}
                      </div>
                      {lastUpdate && (
                        <small className="opacity-75" style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)' }}>
                          Updated: {lastUpdate}
                        </small>
                      )}
                    </div>
                  </div>

                  {/* GPS Accuracy */}
                  <div className="col-12 col-md-6 col-lg-3">
                    <div className="p-3 rounded-3 h-100" style={{
                      background: locationAccuracy ? 
                        locationAccuracy < 20 ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' :
                        locationAccuracy < 50 ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' :
                        locationAccuracy < 100 ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' :
                        'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)' :
                        'linear-gradient(135deg, #636363 0%, #a2ab58 100%)',
                      color: 'white'
                    }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div style={{ fontSize: '1.5rem' }}>🎯</div>
                        <span className="fw-semibold" style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
                          GPS Accuracy
                        </span>
                      </div>
                      <div className="fw-bold" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>
                        {locationAccuracy ? (
                          <>
                            {locationAccuracy < 20 ? 'Excellent' : 
                             locationAccuracy < 50 ? 'Good' : 
                             locationAccuracy < 100 ? 'Fair' : 'Poor'}
                          </>
                        ) : 'Unknown'}
                      </div>
                      {locationAccuracy && (
                        <small className="opacity-75" style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)' }}>
                          {locationAccuracy.toFixed(0)}m accuracy
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Current Location */}
                  <div className="col-12 col-lg-6">
                    <div className="p-3 rounded-3 h-100" style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white'
                    }}>
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <div style={{ fontSize: '1.5rem' }}>📍</div>
                        <span className="fw-semibold" style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
                          Current Location
                        </span>
                      </div>
                      <div className="fw-bold mb-1" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.1rem)' }}>
                        {currentUser.location?.city ? (
                          <>
                            {currentUser.location.city}
                            {currentUser.location.state && `, ${currentUser.location.state}`}
                          </>
                        ) : (
                          'Fetching location...'
                        )}
                      </div>
                      {currentUser.location?.country && (
                        <small className="opacity-75" style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)' }}>
                          🌍 {currentUser.location.country}
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                {/* Detailed Location Info */}
                {locationDetails.coords && (
                  <div className="p-3 rounded-3" style={{
                    background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
                    border: 'none'
                  }}>
                    <div className="row g-2">
                      <div className="col-12 col-md-6 col-lg-3">
                        <small className="d-block mb-1 opacity-75 fw-semibold" style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)' }}>
                          🌐 Coordinates
                        </small>
                        <div className="fw-bold" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
                          {locationDetails.coords.lat.toFixed(4)}°N
                        </div>
                        <div className="fw-bold" style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)' }}>
                          {locationDetails.coords.lng.toFixed(4)}°E
                        </div>
                      </div>
                      
                      {locationDetails.altitude && (
                        <div className="col-12 col-md-6 col-lg-3">
                          <small className="d-block mb-1 opacity-75 fw-semibold" style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)' }}>
                            ⛰️ Altitude
                          </small>
                          <div className="fw-bold" style={{ fontSize: 'clamp(0.9rem, 2.2vw, 1rem)' }}>
                            {locationDetails.altitude.toFixed(1)}m
                          </div>
                        </div>
                      )}
                      
                      {locationDetails.speed && locationDetails.speed > 0 && (
                        <div className="col-12 col-md-6 col-lg-3">
                          <small className="d-block mb-1 opacity-75 fw-semibold" style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)' }}>
                            🚗 Speed
                          </small>
                          <div className="fw-bold" style={{ fontSize: 'clamp(0.9rem, 2.2vw, 1rem)' }}>
                            {(locationDetails.speed * 3.6).toFixed(1)} km/h
                          </div>
                        </div>
                      )}
                      
                      {locationDetails.heading !== null && (
                        <div className="col-12 col-md-6 col-lg-3">
                          <small className="d-block mb-1 opacity-75 fw-semibold" style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)' }}>
                            🧭 Direction
                          </small>
                          <div className="fw-bold" style={{ fontSize: 'clamp(0.9rem, 2.2vw, 1rem)' }}>
                            {locationDetails.heading.toFixed(0)}°
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentUser.location?.fullAddress && (
                  <div className="mt-3 p-3 rounded-3" style={{
                    background: 'rgba(102, 126, 234, 0.1)',
                    border: '2px dashed rgba(102, 126, 234, 0.3)'
                  }}>
                    <small className="text-muted fw-semibold d-block mb-1" style={{ fontSize: 'clamp(0.7rem, 1.8vw, 0.75rem)' }}>
                      🗺️ Full Address
                    </small>
                    <div style={{ fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
                      {currentUser.location.fullAddress}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{
              borderRadius: '20px',
              overflow: 'hidden'
            }}>
              <div className="card-header" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 1.5rem'
              }}>
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>
                  <span>🗺️</span> Live Location Map
                </h5>
              </div>
              <div className="card-body p-0">
                <MapComponent users={users} currentUser={currentUser} />
              </div>
            </div>
          </div>
        </div>

        {/* Users Table Section */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{
              borderRadius: '20px',
              overflow: 'hidden'
            }}>
              <div className="card-header" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                padding: '1rem 1.5rem'
              }}>
                <h5 className="mb-0 fw-bold d-flex align-items-center gap-2" style={{ fontSize: 'clamp(1rem, 3vw, 1.2rem)' }}>
                  <span>👥</span> All Users Tracking
                </h5>
              </div>
              <div className="card-body p-3 p-md-4">
                <UserTable users={users} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }

        .btn {
          transition: all 0.3s ease;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .card-body {
            padding: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;