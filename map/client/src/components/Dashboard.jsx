import React, { useEffect, useState } from 'react';
import { MapPin, Users, Activity, Settings, Home, LogOut, RefreshCw, Navigation, Gauge, Menu, X, ChevronRight, User, Clock, Wifi, Zap, TrendingUp } from 'lucide-react';

const Dashboard = ({ user, onLogout, users = [], locationPermission, locationAccuracy, lastUpdate, locationDetails, updateUserLocation, fetchUsers }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentUser] = useState(user);

  const onlineUsers = users.filter(u => u.location).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-b from-indigo-600 via-purple-600 to-indigo-700 shadow-2xl z-50 transform transition-transform duration-300 ease-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Close Button - Mobile Only */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Profile Section */}
        <div className="p-6 border-b border-white/10">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white to-indigo-100 p-1 shadow-xl">
                {currentUser?.profilePicture ? (
                  <img 
                    src={currentUser.profilePicture}
                    alt={currentUser.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                    {currentUser?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className={`absolute bottom-0 right-0 w-6 h-6 rounded-full ${locationPermission ? 'bg-green-400' : 'bg-red-400'} border-4 border-white shadow-lg animate-pulse`}></div>
            </div>
            <h3 className="text-white text-xl font-bold mb-1">{currentUser?.name}</h3>
            <p className="text-indigo-200 text-sm mb-3">{currentUser?.email}</p>
            {currentUser?.location?.city && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-medium">
                <MapPin className="w-4 h-4" />
                {currentUser.location.city}, {currentUser.location.state}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1">
          {[
            { icon: Home, label: 'Dashboard', active: true },
            { icon: MapPin, label: 'My Location', active: false },
            { icon: Users, label: 'Friends', active: false },
            { icon: Navigation, label: 'Map View', active: false },
            { icon: Settings, label: 'Settings', active: false }
          ].map((item, index) => (
            <button
              key={index}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                item.active 
                  ? 'bg-white text-indigo-600 shadow-lg' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? 'text-indigo-600' : 'text-white'}`} />
              <span className="font-medium flex-1 text-left">{item.label}</span>
              {item.active && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </nav>

        {/* Quick Stats */}
        <div className="absolute bottom-20 left-0 right-0 p-4">
          <p className="text-indigo-200 text-xs uppercase tracking-wider mb-3 font-semibold">Quick Stats</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Friends', value: users.length },
              { label: 'Online', value: onlineUsers },
              { label: 'Accuracy', value: locationAccuracy ? `${locationAccuracy.toFixed(0)}m` : 'N/A' }
            ].map((stat, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-md rounded-lg p-3 text-center">
                <div className="text-white text-lg font-bold">{stat.value}</div>
                <div className="text-indigo-200 text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-80 min-h-screen">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
          <div className="px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              {/* Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Title */}
              <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Location Tracker
              </h1>

              {/* Profile Quick Access */}
              <button 
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-3 hover:bg-gray-100 rounded-xl p-2 transition-all duration-200"
              >
                <div className="hidden md:block text-right">
                  <div className="text-sm font-semibold text-gray-900">{currentUser?.name}</div>
                  <div className="text-xs text-gray-500 flex items-center justify-end gap-1">
                    <div className={`w-2 h-2 rounded-full ${locationPermission ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                    {locationPermission ? 'Live Tracking' : 'Offline'}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  {currentUser?.name?.charAt(0).toUpperCase()}
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-8 space-y-6">
          {/* Welcome Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                    Welcome back, {currentUser?.name}! 👋
                  </h2>
                  <p className="text-indigo-100">Your location is being tracked in real-time</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => {
                      if (navigator.geolocation && updateUserLocation) {
                        navigator.geolocation.getCurrentPosition(
                          (pos) => updateUserLocation(pos.coords.latitude, pos.coords.longitude),
                          (err) => console.error('Location error:', err),
                          { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
                        );
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-indigo-600 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  >
                    <MapPin className="w-4 h-4" />
                    Update Location
                  </button>
                  <button 
                    onClick={fetchUsers}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/20 backdrop-blur-md text-white rounded-xl font-medium hover:bg-white/30 transition-all duration-200"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* User Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Email</span>
                  </div>
                  <p className="text-gray-900 font-semibold">{currentUser?.email}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Activity className="w-4 h-4" />
                    <span className="text-sm font-medium">Tracking Status</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${locationPermission ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {locationPermission ? '🟢 Live Tracking Active' : '🔴 Inactive'}
                    </span>
                    {lastUpdate && (
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lastUpdate}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Current Location</span>
                  </div>
                  {currentUser?.location?.city ? (
                    <div>
                      <p className="text-indigo-600 font-bold text-lg">
                        {currentUser.location.city}
                        {currentUser.location.state && `, ${currentUser.location.state}`}
                      </p>
                      {currentUser.location.fullAddress && (
                        <p className="text-gray-500 text-sm mt-1">{currentUser.location.fullAddress}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-400">Fetching location...</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Gauge className="w-4 h-4" />
                    <span className="text-sm font-medium">GPS Accuracy</span>
                  </div>
                  {locationAccuracy ? (
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      locationAccuracy < 20 ? 'bg-green-100 text-green-700' : 
                      locationAccuracy < 50 ? 'bg-blue-100 text-blue-700' : 
                      locationAccuracy < 100 ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {locationAccuracy < 20 ? '🟢 Excellent' : 
                       locationAccuracy < 50 ? '🔵 Good' : 
                       locationAccuracy < 100 ? '🟡 Fair' : '🔴 Poor'} ({locationAccuracy.toFixed(0)}m)
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gray-100 text-gray-700">
                      Unknown
                    </span>
                  )}
                </div>
              </div>

              {/* Coordinates Info */}
              {locationDetails?.coords && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Navigation className="w-4 h-4 text-indigo-600" />
                      <span className="text-gray-600">Coordinates:</span>
                      <span className="font-mono font-semibold text-gray-900">
                        {locationDetails.coords.lat.toFixed(6)}°N, {locationDetails.coords.lng.toFixed(6)}°E
                      </span>
                    </div>
                    {locationDetails.altitude && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">⛰️ Altitude:</span>
                        <span className="font-semibold text-gray-900">{locationDetails.altitude.toFixed(1)}m</span>
                      </div>
                    )}
                    {locationDetails.speed && locationDetails.speed > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">🚗 Speed:</span>
                        <span className="font-semibold text-gray-900">{(locationDetails.speed * 3.6).toFixed(1)} km/h</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Users, label: 'Total Friends', value: users.length, color: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50' },
              { icon: Wifi, label: 'Online Now', value: onlineUsers, color: 'from-green-500 to-emerald-500', bg: 'from-green-50 to-emerald-50' },
              { icon: TrendingUp, label: 'Active Today', value: users.length, color: 'from-purple-500 to-pink-500', bg: 'from-purple-50 to-pink-50' },
              { icon: Zap, label: 'Accuracy', value: locationAccuracy ? `${locationAccuracy.toFixed(0)}m` : 'N/A', color: 'from-orange-500 to-red-500', bg: 'from-orange-50 to-red-50' }
            ].map((stat, index) => (
              <div key={index} className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Map Placeholder - Using passed MapComponent if available */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Navigation className="w-5 h-5" />
                Live Location Map
              </h3>
            </div>
            <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <div className="text-center p-8">
                <Navigation className="w-16 h-16 mx-auto text-indigo-400 mb-4" />
                <p className="text-gray-600 font-medium">Interactive map will be displayed here</p>
                <p className="text-gray-400 text-sm mt-2">Showing real-time locations of all users</p>
              </div>
            </div>
          </div>

          {/* Users Table */}
          {users.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Friends Location
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((u, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {u.profilePicture ? (
                              <img src={u.profilePicture} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                {u.name?.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <span className="font-medium text-gray-900">{u.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {u.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-indigo-500" />
                            {u.location?.city || 'Unknown'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.location ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            {u.location ? '🟢 Online' : '⚫ Offline'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;