import React, { useState, useEffect } from "react";

const Login = ({ onLoginSuccess }) => {
  const [showContent, setShowContent] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 500);
    const timer2 = setTimeout(() => setAnimationComplete(true), 2500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleGoogleLogin = () => {
    // Redirect to Google OAuth or handle login
    alert("Google Login button clicked. Connect your Google OAuth here.");
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Circles */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '10%',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '250px',
        height: '250px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite',
        animationDelay: '2s'
      }}></div>

      {/* Main Container */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '450px',
        transition: 'all 1s ease',
        opacity: showContent ? 1 : 0,
        transform: showContent ? 'translateY(0)' : 'translateY(30px)'
      }}>
        {/* Welcome Animation Text */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          transition: 'all 1s ease',
          opacity: animationComplete ? 0 : 1,
          maxHeight: animationComplete ? '0' : '400px',
          overflow: 'hidden'
        }}>
          {/* Globe Icon Animation */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              position: 'relative',
              width: '100px',
              height: '100px'
            }}>
              {/* Globe */}
              <svg style={{
                width: '100px',
                height: '100px',
                animation: 'spin 4s linear infinite'
              }} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
              {/* Pin */}
              <svg style={{
                width: '40px',
                height: '40px',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animation: 'bounce 2s ease-in-out infinite',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
              }} viewBox="0 0 24 24" fill="#ef4444" stroke="white" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3" fill="white"/>
              </svg>
            </div>
          </div>

          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '15px',
            animation: 'fadeInUp 1s ease',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            Welcome to Your Friends' World
          </h1>
          <p style={{
            fontSize: '1.25rem',
            color: 'rgba(255, 255, 255, 0.9)',
            animation: 'fadeInUp 1s ease 0.3s both',
            textShadow: '0 1px 5px rgba(0,0,0,0.1)'
          }}>
            Where Every Friend Shows Their Location
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          padding: '40px',
          transition: 'all 1s ease',
          opacity: animationComplete ? 1 : 0,
          transform: animationComplete ? 'scale(1)' : 'scale(0.95)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '15px',
                borderRadius: '50%',
                display: 'inline-block'
              }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
            </div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '10px'
            }}>
              Location Tracker
            </h2>
            <p style={{ color: '#6b7280' }}>
              Sign in to connect with your friends
            </p>
          </div>

          {/* Features */}
          <div style={{ marginBottom: '30px' }}>
            {[
              { icon: '👥', text: 'See your friends in real-time', color: '#3b82f6' },
              { icon: '📍', text: 'Share your location safely', color: '#8b5cf6' },
              { icon: '🌍', text: 'Stay connected anywhere', color: '#ec4899' }
            ].map((feature, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '15px',
                backgroundColor: `${feature.color}15`,
                borderRadius: '10px',
                marginBottom: '10px',
                transition: 'transform 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                <span style={{ fontSize: '24px' }}>{feature.icon}</span>
                <span style={{ color: '#374151', fontSize: '14px' }}>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: '600',
              padding: '15px',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>

          <p style={{
            fontSize: '12px',
            color: '#9ca3af',
            textAlign: 'center',
            marginTop: '20px'
          }}>
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translate(-50%, -50%) translateY(0); }
          50% { transform: translate(-50%, -50%) translateY(-10px); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Login; 