import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { googleLogin } from "../services/api";

const Login = ({ onLoginSuccess }) => {
  const handleSuccess = async (credentialResponse) => {
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
    }
  };

  const handleError = () => {
    toast.error("Google login failed");
  };

  return (
    <GoogleOAuthProvider clientId="207839867306-jd8octkaf6pk60sc6sv0d8r88rpdninl.apps.googleusercontent.com">
      <div className="container vh-100 d-flex align-items-center justify-content-center">
        <div
          className="card shadow-lg"
          style={{ maxWidth: "400px", width: "100%" }}
        >
          <div className="card-body p-5 text-center">
            <h2 className="mb-4">Location Tracker</h2>
            <p className="text-muted mb-4">Sign in with your Google account</p>

            <div className="d-flex justify-content-center">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={handleError}
                theme="filled_blue"
                size="large"
                text="signin_with"
                shape="rectangular"
              />
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
