import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { GoogleLogin } from "@react-oauth/google";
import { MessageCircle, Mail, Lock, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function Login() {
  const [values, setValues] = useState({ email: "", password: "" });
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert({ msg: "", type: "" }), 1500);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.post("/auth/login", values);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      showAlert("Login successful", "success");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      showAlert(err.response?.data?.message || "Login failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    setIsLoading(true);
    try {
      await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      showAlert("Google login successful", "success");
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setTimeout(() => navigate("/"), 600);
    } catch (err) {
      showAlert(err.response?.data?.message || "Google login failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--bg-gradient-start), var(--bg-gradient-mid), var(--bg-gradient-end))",
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            backgroundColor: "var(--accent-primary)",
            top: "-10%",
            right: "-10%",
            animationDuration: "4s",
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            backgroundColor: "var(--accent-secondary)",
            bottom: "-10%",
            left: "-10%",
            animationDuration: "6s",
          }}
        />
      </div>

      {/* Card */}
      <div
        className="w-full max-w-md rounded-2xl p-8 relative z-10 border"
        style={{
          backgroundColor: "var(--bg-card)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          borderColor: "var(--border-main)",
        }}
      >
        {/* Back Button */}
        <div className="flex justify-start">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{
              color: "var(--accent-secondary)",
              border: "1px solid var(--border-main)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(139, 92, 246, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2 shadow-lg transition-transform duration-300 hover:scale-110"
            style={{ backgroundColor: "var(--accent-primary)" }}
          >
            <MessageCircle className="text-black w-8 h-8" strokeWidth={2.5} />
          </div>

          <h2
            className="text-3xl font-bold mb-1"
            style={{ color: "var(--text-main)" }}
          >
            Welcome back
          </h2>
          <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
            Log in to continue to Talkify
          </p>
        </div>

        {/* Alert */}
        {alert.msg && (
          <div
            className={`mb-2 text-sm px-4 py-3 rounded-lg text-center flex items-center justify-center gap-2 animate-slideIn`}
            style={{
              backgroundColor:
                alert.type === "success"
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(239,68,68,0.15)",
              color:
                alert.type === "success" ? "var(--success)" : "var(--danger)",
              border: `1px solid ${
                alert.type === "success" ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"
              }`,
            }}
          >
            {alert.type === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            {alert.msg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              className="text-sm font-medium mb-1 block"
              style={{ color: "var(--text-label)" }}
            >
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{
                  color: focusedField === "email" ? "var(--accent-primary)" : "var(--text-muted)",
                  transition: "color 0.2s",
                }}
              />
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
                placeholder="name@example.com"
                required
                className="w-full pl-11 pr-4 py-2 rounded-lg outline-none transition-all duration-200"
                style={{
                  backgroundColor: "var(--bg-input)",
                  color: "var(--text-main)",
                  border: `2px solid ${
                    focusedField === "email" ? "var(--accent-primary)" : "var(--border-input)"
                  }`,
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              className="text-sm font-medium mb-1 block"
              style={{ color: "var(--text-label)" }}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{
                  color: focusedField === "password" ? "var(--accent-primary)" : "var(--text-muted)",
                  transition: "color 0.2s",
                }}
              />
              <input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onFocus={() => setFocusedField("password")}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                required
                className="w-full pl-11 pr-4 py-2 rounded-lg outline-none transition-all duration-200"
                style={{
                  backgroundColor: "var(--bg-input)",
                  color: "var(--text-main)",
                  border: `2px solid ${
                    focusedField === "password" ? "var(--accent-primary)" : "var(--border-input)"
                  }`,
                }}
              />
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm font-medium hover:underline transition-colors duration-200"
              style={{ color: "var(--accent-secondary)" }}
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "#020617",
            }}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Logging in...
              </span>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3">
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-main)" }} />
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Or continue with
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: "var(--border-main)" }} />
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <div
            className="w-half transition-transform duration-200 hover:scale-105"
            style={{
              filter: isLoading ? "grayscale(1) opacity(0.5)" : "none",
              pointerEvents: isLoading ? "none" : "auto",
            }}
          >
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              width="100%"
              theme="outline"
              size="large"
              shape="rectangular"
              text="continue_with"
            />
          </div>
        </div>

        {/* Signup Link */}
        <p
          className="mt-8 text-center text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Don't have an account?{" "}
          <Link
            to="/Signin"
            className="font-semibold hover:underline transition-colors duration-200"
            style={{ color: "var(--accent-secondary)" }}
          >
            Sign up
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default Login;