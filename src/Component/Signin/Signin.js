import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import { MessageCircle, User, Mail, Lock, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const queryClient = useQueryClient();
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const navigate = useNavigate();

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
      await api.post("/auth/signin", values);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      showAlert("Account created successfully", "success");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      showAlert(err.response?.data?.message || "Signup failed", "error");
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
        <div className="flex flex-col items-center mb-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-transform duration-300 hover:scale-110"
            style={{ backgroundColor: "var(--accent-primary)" }}
          >
            <MessageCircle className="text-black w-8 h-8" strokeWidth={2.5} />
          </div>

          <h2
            className="text-3xl font-bold mb-1"
            style={{ color: "var(--text-main)" }}
          >
            Create your account
          </h2>

          <p className="text-sm text-center" style={{ color: "var(--text-muted)" }}>
            Join Talkify and start chatting
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
          {/* Name Field */}
          <div>
            <label
              className="text-sm font-medium mb-1 block"
              style={{ color: "var(--text-label)" }}
            >
              Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                style={{
                  color: focusedField === "name" ? "var(--accent-primary)" : "var(--text-muted)",
                  transition: "color 0.2s",
                }}
              />
              <input
                type="text"
                name="name"
                value={values.name}
                onChange={handleChange}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Your name"
                required
                className="w-full pl-11 pr-4 py-2 rounded-lg outline-none transition-all duration-200"
                style={{
                  backgroundColor: "var(--bg-input)",
                  color: "var(--text-main)",
                  border: `2px solid ${
                    focusedField === "name" ? "var(--accent-primary)" : "var(--border-input)"
                  }`,
                }}
              />
            </div>
          </div>

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
            <p className="text-xs mt-2 opacity-60" style={{ color: "var(--text-muted)" }}>
              Must be at least 8 characters
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
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
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Terms and Privacy */}
        <p
          className="mt-3 text-center text-xs leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          By creating an account, you agree to our{" "}
          <a
            href="/terms"
            className="underline hover:opacity-80 transition-opacity"
            style={{ color: "var(--accent-secondary)" }}
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            className="underline hover:opacity-80 transition-opacity"
            style={{ color: "var(--accent-secondary)" }}
          >
            Privacy Policy
          </a>
        </p>

        {/* Login link */}
        <p
          className="mt-2 text-center text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold hover:underline transition-colors duration-200"
            style={{ color: "var(--accent-secondary)" }}
          >
            Log in
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

export default Signup;