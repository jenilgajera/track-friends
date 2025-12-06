import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ users, currentUser }) => {
  const [center, setCenter] = useState([23.0225, 72.5714]); // Default: Rajkot

  useEffect(() => {
    if (currentUser?.location?.latitude && currentUser?.location?.longitude) {
      setCenter([currentUser.location.latitude, currentUser.location.longitude]);
    }
  }, [currentUser]);

  const getUsersWithLocation = () => {
    return users.filter(user => 
      user.location?.latitude && 
      user.location?.longitude
    );
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">User Locations</h5>
      </div>
      <div className="card-body p-0">
        <MapContainer
          center={center}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {getUsersWithLocation().map((user) => (
            <Marker
              key={user._id}
              position={[user.location.latitude, user.location.longitude]}
            >
              <Popup>
                <div className="text-center">
                  {user.profilePicture && (
                    <img 
                      src={user.profilePicture} 
                      alt={user.name}
                      className="rounded-circle mb-2"
                      style={{ width: '50px', height: '50px' }}
                    />
                  )}
                  <p className="mb-1"><strong>{user.name}</strong></p>
                  <p className="mb-0 small text-muted">{user.email}</p>
                  {user.location.city && (
                    <p className="mb-0 small">
                      <strong>📍 {user.location.city}</strong>
                      {user.location.state && `, ${user.location.state}`}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapComponent;