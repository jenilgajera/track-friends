import React from 'react';

const UserTable = ({ users }) => {
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-IN', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  return (
    <div className="card shadow-sm">
      <div className="card-header bg-success text-white">
        <h5 className="mb-0">All Users</h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Email</th>
                <th>City</th>
                <th>State</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Last Updated</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-muted">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="rounded-circle"
                          style={{ width: '40px', height: '40px' }}
                        />
                      ) : (
                        <div
                          className="rounded-circle bg-secondary d-inline-flex align-items-center justify-content-center text-white"
                          style={{ width: '40px', height: '40px' }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="align-middle">{user.name}</td>
                    <td className="align-middle">{user.email}</td>
                    <td className="align-middle">
                      {user.location?.city || 'N/A'}
                    </td>
                    <td className="align-middle">
                      {user.location?.state || 'N/A'}
                    </td>
                    <td className="align-middle">
                      {user.location?.latitude ? 
                        user.location.latitude.toFixed(6) : 
                        'N/A'
                      }
                    </td>
                    <td className="align-middle">
                      {user.location?.longitude ? 
                        user.location.longitude.toFixed(6) : 
                        'N/A'
                      }
                    </td>
                    <td className="align-middle">
                      {formatDate(user.location?.lastUpdated)}
                    </td>
                    <td className="align-middle">
                      <span className={`badge ${user.isOnline ? 'bg-success' : 'bg-secondary'}`}>
                        {user.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserTable;