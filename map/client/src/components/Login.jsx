import React, { useState, useEffect } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { googleLogin } from "../services/api";

const Login = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const result = await googleLogin(credentialResponse.credential);

      if (result.success) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        toast.success("Login successful!");
        onLoginSuccess(result.user);
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = () => {
    toast.error("Google login failed");
    setLoading(false);
  };

  if (initialLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden" 
           style={{ 
             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
           }}>
        
        {/* Water Wave Animation */}
        <div className="position-absolute w-100 h-100 overflow-hidden">
          <svg className="position-absolute bottom-0 w-100" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '40%' }}>
            <path fill="rgba(255, 255, 255, 0.1)" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
              <animate attributeName="d" dur="10s" repeatCount="indefinite" values="
                M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,160L48,144C96,128,192,96,288,96C384,96,480,128,576,144C672,160,768,160,864,144C960,128,1056,96,1152,96C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
            </path>
          </svg>
          <svg className="position-absolute bottom-0 w-100" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '35%' }}>
            <path fill="rgba(255, 255, 255, 0.05)" fillOpacity="1" d="M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,176C672,192,768,192,864,176C960,160,1056,128,1152,128C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
              <animate attributeName="d" dur="8s" repeatCount="indefinite" values="
                M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,176C672,192,768,192,864,176C960,160,1056,128,1152,128C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,128L48,144C96,160,192,192,288,192C384,192,480,160,576,144C672,128,768,128,864,144C960,160,1056,192,1152,192C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
                M0,192L48,176C96,160,192,128,288,128C384,128,480,160,576,176C672,192,768,192,864,176C960,160,1056,128,1152,128C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
            </path>
          </svg>
        </div>

        <div className="text-center position-relative" style={{ zIndex: 2 }}>
          {/* Animated Logo */}
          <div className="mb-4 d-flex justify-content-center">
            <div className="position-relative d-inline-block">
              <div className="position-relative" style={{ animation: 'bounce 1s ease-in-out infinite' }}>
                <div className="d-flex align-items-center justify-content-center rounded-circle mx-auto"
                     style={{
                       width: '100px',
                       height: '100px',
                       background: 'rgba(255, 255, 255, 0.2)',
                       backdropFilter: 'blur(10px)',
                       boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
                     }}>
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" 
                          fill="white"/>
                  </svg>
                </div>
              </div>
              {/* Pulse Rings */}
              <div className="position-absolute top-50 start-50 translate-middle">
                <div style={{
                  width: '100px',
                  height: '100px',
                  border: '3px solid rgba(255, 255, 255, 0.5)',
                  borderRadius: '50%',
                  animation: 'pulse 2s ease-out infinite'
                }}></div>
              </div>
              <div className="position-absolute top-50 start-50 translate-middle">
                <div style={{
                  width: '100px',
                  height: '100px',
                  border: '3px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  animation: 'pulse 2s ease-out infinite 0.5s'
                }}></div>
              </div>
            </div>
          </div>

          {/* Company Name with Gradient */}
          <h1 className="mb-3 fw-bold px-3" style={{
            color: 'white',
            fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
            textShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
            animation: 'fadeInUp 0.8s ease-out',
            letterSpacing: '1px'
          }}>
            Location bro.......
          </h1>

          {/* Loading Text */}
          <p className="mb-4 px-3" style={{
            color: 'rgba(255, 255, 255, 0.9)',
            fontSize: 'clamp(1rem, 3vw, 1.1rem)',
            animation: 'fadeInUp 0.8s ease-out 0.2s backwards'
          }}>
            wait a moment...
          </p>

          {/* Animated Dots Loader */}
          <div className="d-flex justify-content-center align-items-center gap-2 mb-4" 
               style={{ animation: 'fadeInUp 0.8s ease-out 0.4s backwards' }}>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'white',
              animation: 'dotBounce 1.4s ease-in-out infinite'
            }}></div>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'white',
              animation: 'dotBounce 1.4s ease-in-out infinite 0.2s'
            }}></div>
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'white',
              animation: 'dotBounce 1.4s ease-in-out infinite 0.4s'
            }}></div>
          </div>

          {/* Progress Bar */}
          <div className="mx-auto px-3" style={{ 
            width: '100%',
            maxWidth: '300px',
            animation: 'fadeInUp 0.8s ease-out 0.6s backwards'
          }}>
            <div style={{
              height: '4px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                background: 'white',
                borderRadius: '10px',
                animation: 'progressBar 3s ease-out forwards',
                boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
              }}></div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15px);
            }
          }

          @keyframes pulse {
            0% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(1.8);
              opacity: 0;
            }
          }

          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes dotBounce {
            0%, 80%, 100% {
              transform: scale(0.8);
              opacity: 0.5;
            }
            40% {
              transform: scale(1.2);
              opacity: 1;
            }
          }

          @keyframes progressBar {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }

          @media (max-width: 576px) {
            svg {
              height: 30% !important;
            }
          }
        `}</style>
      </div>
    );
  }

  return (
    <GoogleOAuthProvider clientId="207839867306-jd8octkaf6pk60sc6sv0d8r88rpdninl.apps.googleusercontent.com">
      <div className="min-vh-100 d-flex align-items-center justify-content-center position-relative overflow-hidden" 
           style={{ 
             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
             animation: 'fadeIn 0.5s ease-in'
           }}>
        
        {/* Animated Background Elements */}
        <div className="position-absolute w-100 h-100" style={{ overflow: 'hidden' }}>
          <div className="position-absolute rounded-circle" 
               style={{
                 width: 'clamp(200px, 30vw, 300px)',
                 height: 'clamp(200px, 30vw, 300px)',
                 background: 'rgba(255, 255, 255, 0.1)',
                 top: '-50px',
                 right: '-50px',
                 animation: 'float 6s ease-in-out infinite'
               }}></div>
          <div className="position-absolute rounded-circle" 
               style={{
                 width: 'clamp(150px, 20vw, 200px)',
                 height: 'clamp(150px, 20vw, 200px)',
                 background: 'rgba(255, 255, 255, 0.1)',
                 bottom: '-30px',
                 left: '-30px',
                 animation: 'float 8s ease-in-out infinite'
               }}></div>
        </div>

        {/* Login Card */}
        <div className="container position-relative px-3" style={{ zIndex: 1 }}>
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5" style={{ maxWidth: '450px' }}>
              <div className="card border-0 shadow-lg" 
                   style={{
                     borderRadius: '20px',
                     backdropFilter: 'blur(10px)',
                     background: 'rgba(255, 255, 255, 0.95)',
                     animation: 'slideInUp 0.6s ease-out'
                   }}>
                <div className="card-body p-4 p-sm-5 position-relative">
                  
                  {/* Logo/Icon */}
                  <div className="text-center mb-4">
                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                         style={{
                           width: 'clamp(70px, 15vw, 80px)',
                           height: 'clamp(70px, 15vw, 80px)',
                           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                           boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
                         }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" 
                              fill="white"/>
                      </svg>
                    </div>
                    <h2 className="fw-bold mb-2" style={{ 
                      color: '#2d3748',
                      fontSize: 'clamp(1.3rem, 4vw, 1.75rem)'
                    }}>
                    Connect & Track
                    </h2>
                    <p className="text-muted mb-0" style={{ fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)' }}>
                      Track and manage locations effortlessly
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="d-flex align-items-center my-4">
                    <div className="flex-grow-1" style={{ height: '1px', background: '#e2e8f0' }}></div>
                    <span className="px-3 text-muted" style={{ fontSize: 'clamp(0.75rem, 2vw, 0.85rem)' }}>
                      Sign in to continue
                    </span>
                    <div className="flex-grow-1" style={{ height: '1px', background: '#e2e8f0' }}></div>
                  </div>

                  {/* Loading Overlay */}
                  {loading && (
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
                         style={{
                           background: 'rgba(255, 255, 255, 0.95)',
                           borderRadius: '20px',
                           zIndex: 10,
                           animation: 'fadeIn 0.3s ease-in'
                         }}>
                      <div className="text-center">
                        {/* Rotating Circular Loader */}
                        <div className="position-relative d-inline-block mb-3">
                          <div style={{
                            width: 'clamp(50px, 12vw, 60px)',
                            height: 'clamp(50px, 12vw, 60px)',
                            border: '4px solid #e2e8f0',
                            borderTop: '4px solid #667eea',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite'
                          }}></div>
                          <div className="position-absolute top-50 start-50 translate-middle">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" 
                                    fill="#667eea"/>
                            </svg>
                          </div>
                        </div>
                        <p className="fw-semibold mb-0" style={{ 
                          color: '#667eea', 
                          fontSize: 'clamp(1rem, 3vw, 1.1rem)' 
                        }}>
                          Wait bro...
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Google Login Button */}
                  <div className="d-flex justify-content-center">
                    <div style={{ width: '100%', maxWidth: '280px' }}>
                      <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={handleError}
                        theme="filled_blue"
                        size="large"
                        text="signin_with"
                        shape="rectangular"
                        width="100%"
                      />
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-4 pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
                    <div className="row g-2 g-sm-3 text-center">
                      <div className="col-4">
                        <div className="p-2">
                          <div className="mb-2" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>🔒</div>
                          <small className="text-muted d-block" style={{ fontSize: 'clamp(0.7rem, 2vw, 0.75rem)' }}>
                            Secure
                          </small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-2">
                          <div className="mb-2" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>⚡</div>
                          <small className="text-muted d-block" style={{ fontSize: 'clamp(0.7rem, 2vw, 0.75rem)' }}>
                            Fast
                          </small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-2">
                          <div className="mb-2" style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)' }}>📍</div>
                          <small className="text-muted d-block" style={{ fontSize: 'clamp(0.7rem, 2vw, 0.75rem)' }}>
                            Accurate
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer Text */}
              <p className="text-center mt-3 mt-sm-4 mb-0 px-3" style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
                animation: 'fadeInUp 0.8s ease-out 0.4s backwards'
              }}>
                Powered by Google Authentication
              </p>
            </div>
          </div>
        </div>

        {/* CSS Animation */}
        <style>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          .card {
            transition: transform 0.3s ease;
          }

          .card:hover {
            transform: translateY(-5px);
          }

          @media (max-width: 576px) {
            .card-body {
              padding: 1.5rem !important;
            }
          }
        `}</style>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;