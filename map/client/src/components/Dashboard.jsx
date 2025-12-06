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
    // Connect to socket
    const socket = io('http://localhost:5000');

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

    // Request location permission
    requestLocationPermission();

    // Fetch initial users
    fetchUsers();

    // **Auto refresh users every 30 seconds**
    const intervalId = setInterval(() => {
      fetchUsers();
      console.log('🔄 Auto-refreshing users...');
    }, 30000); // 30 seconds

    return () => {
      socket.disconnect();
      clearInterval(intervalId);
      
      // Stop location tracking when component unmounts
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        console.log('🛑 Location tracking stopped');
      }
    };
  }, []);

  const requestLocationPermission = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(true);
          updateUserLocation(position.coords.latitude, position.coords.longitude);
          toast.success('Location tracking started!');
          
          // **Continuous Location Tracking - Real-time Update**
          const id = navigator.geolocation.watchPosition(
            (pos) => {
              const accuracy = pos.coords.accuracy;
              setLocationAccuracy(accuracy);
              
              // Store detailed location info
              setLocationDetails({
                coords: {
                  lat: pos.coords.latitude,
                  lng: pos.coords.longitude
                },
                speed: pos.coords.speed,
                heading: pos.coords.heading,
                altitude: pos.coords.altitude
              });
              
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('📍 LIVE LOCATION UPDATE');
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              console.log('🌐 Latitude:', pos.coords.latitude);
              console.log('🌐 Longitude:', pos.coords.longitude);
              console.log('🎯 Accuracy:', accuracy.toFixed(2), 'meters');
              console.log('⛰️  Altitude:', pos.coords.altitude ? pos.coords.altitude.toFixed(2) + 'm' : 'N/A');
              console.log('🚗 Speed:', pos.coords.speed ? (pos.coords.speed * 3.6).toFixed(2) + ' km/h' : 'Stationary');
              console.log('🧭 Heading:', pos.coords.heading ? pos.coords.heading + '°' : 'N/A');
              console.log('📡 Source:', pos.coords.altitudeAccuracy !== null ? '🛰️ GPS' : '📶 WiFi/Network');
              console.log('⏰ Time:', new Date(pos.timestamp).toLocaleTimeString());
              console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
              
              // Only update if accuracy is good (< 100m)
              if (accuracy < 100) {
                updateUserLocation(pos.coords.latitude, pos.coords.longitude);
              } else {
                console.warn('⚠️ Accuracy too low, waiting for better signal...');
                toast.warning(`Low accuracy: ${accuracy.toFixed(0)}m - Waiting for better GPS signal...`, {
                  autoClose: 2000
                });
              }
            },
            (error) => {
              console.error('❌ Location tracking error:', error);
              if (error.code === 1) {
                toast.error('Location permission denied');
              } else if (error.code === 2) {
                toast.error('Location unavailable');
              } else {
                toast.error('Location timeout');
              }
            },
            { 
              enableHighAccuracy: true,      // ⚠️ GPS mode - MUST be true
              timeout: 20000,                // 20 seconds timeout
              maximumAge: 0                  // NO cache - always fresh
            }
          );

          setWatchId(id);
          console.log('✅ Location watch started with ID:', id);
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
      
      // Reverse Geocoding - Get city name from coordinates
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
      
      setLastUpdate(new Date().toLocaleTimeString());
      toast.success(`✅ Location updated: ${cityData.city}`, {
        autoClose: 2000
      });
      
      console.log('✅ Location updated successfully in database');
    } catch (error) {
      console.error('❌ Failed to update location:', error);
      toast.error('Location update failed');
    }
  };

  const getCityFromCoordinates = async (lat, lon) => {
    try {
      console.log('🔍 Fetching address for:', lat, lon);
      
      // OpenStreetMap Nominatim API (Free Reverse Geocoding)
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
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid">
          <span className="navbar-brand">Location Tracker</span>
          <div className="d-flex align-items-center">
            {currentUser.profilePicture && (
              <img
                src={currentUser.profilePicture}
                alt={currentUser.name}
                className="rounded-circle me-2"
                style={{ width: '40px', height: '40px' }}
              />
            )}
            <span className="text-white me-3">{currentUser.name}</span>
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container-fluid py-4">
        <div className="row mb-4">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Welcome, {currentUser.name}!</h4>
                  <div>
                    <button 
                      className="btn btn-success btn-sm me-2"
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
                      📍 Update My Location
                    </button>
                    <button 
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        fetchUsers();
                        toast.info('Refreshing users...', { autoClose: 1500 });
                      }}
                    >
                      🔄 Refresh Data
                    </button>
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>📧 Email:</strong> {currentUser.email}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>🎯 Tracking Status:</strong>{' '}
                      <span className={`badge ${locationPermission ? 'bg-success' : 'bg-danger'}`}>
                        {locationPermission ? '🟢 Live Tracking Active' : '🔴 Inactive'}
                      </span>
                      {lastUpdate && (
                        <small className="text-muted ms-2">
                          Last: {lastUpdate}
                        </small>
                      )}
                    </p>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>📍 Current Location:</strong>{' '}
                      {currentUser.location?.city ? (
                        <span className="text-primary fw-bold">
                          {currentUser.location.city}
                          {currentUser.location.state && `, ${currentUser.location.state}`}
                          {currentUser.location.country && ` (${currentUser.location.country})`}
                        </span>
                      ) : (
                        <span className="text-muted">Fetching...</span>
                      )}
                    </p>
                    {currentUser.location?.fullAddress && (
                      <p className="mb-0 small text-muted">
                        🗺️ {currentUser.location.fullAddress}
                      </p>
                    )}
                  </div>
                  <div className="col-md-6">
                    <p className="mb-2">
                      <strong>🎯 GPS Accuracy:</strong>{' '}
                      {locationAccuracy ? (
                        <span className={`badge ${locationAccuracy < 20 ? 'bg-success' : locationAccuracy < 50 ? 'bg-info' : locationAccuracy < 100 ? 'bg-warning' : 'bg-danger'}`}>
                          {locationAccuracy < 20 ? '🟢 Excellent' : locationAccuracy < 50 ? '🔵 Good' : locationAccuracy < 100 ? '🟡 Fair' : '🔴 Poor'} ({locationAccuracy.toFixed(0)}m)
                        </span>
                      ) : (
                        <span className="badge bg-secondary">Unknown</span>
                      )}
                    </p>
                  </div>
                </div>

                {locationDetails.coords && (
                  <div className="row">
                    <div className="col-12">
                      <div className="alert alert-info mb-0">
                        <small>
                          <strong>🌐 Coordinates:</strong> {locationDetails.coords.lat.toFixed(6)}°N, {locationDetails.coords.lng.toFixed(6)}°E
                          {locationDetails.altitude && (
                            <span className="ms-3">
                              <strong>⛰️ Altitude:</strong> {locationDetails.altitude.toFixed(1)}m
                            </span>
                          )}
                          {locationDetails.speed && locationDetails.speed > 0 && (
                            <span className="ms-3">
                              <strong>🚗 Speed:</strong> {(locationDetails.speed * 3.6).toFixed(1)} km/h
                            </span>
                          )}
                          {locationDetails.heading !== null && (
                            <span className="ms-3">
                              <strong>🧭 Direction:</strong> {locationDetails.heading.toFixed(0)}°
                            </span>
                          )}
                        </small>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-4">
          <div className="col-12">
            <MapComponent users={users} currentUser={currentUser} />
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <UserTable users={users} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;