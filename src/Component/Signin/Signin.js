import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";
import {
  MessageCircle,
  User,
  Mail,
  Lock,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  Check,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

function Signup() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    otp: "",
  });
  const queryClient = useQueryClient();
  const [alert, setAlert] = useState({ msg: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  // OTP Timer and Attempts
  const [otpTimer, setOtpTimer] = useState(0); // Time remaining in seconds
  const [otpAttempts, setOtpAttempts] = useState(3); // Remaining verification attempts
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();

  // Timer countdown effect
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Format timer display (MM:SS)
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const showAlert = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert({ msg: "", type: "" }), 3000);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    if (!values.email) {
      showAlert("Please enter your email first", "error");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      showAlert("Please enter a valid email address", "error");
      return;
    }

    setIsSendingOtp(true);
    try {
      await api.post("/auth/send-otp", { email: values.email });
      setOtpSent(true);
      setOtpTimer(120); // 2 minutes = 120 seconds
      setCanResend(false);
      setOtpAttempts(3); // Reset attempts for new OTP
      setValues({ ...values, otp: "" }); // Clear previous OTP input
      showAlert("OTP sent to your email", "success");
    } catch (err) {
      showAlert(err.response?.data?.message || "Failed to send OTP", "error");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!values.otp) {
      showAlert("Please enter the OTP", "error");
      return;
    }

    if (values.otp.length !== 6) {
      showAlert("OTP must be 6 digits", "error");
      return;
    }

    // Check if OTP has expired
    if (otpTimer === 0) {
      showAlert("OTP has expired. Please request a new one.", "error");
      return;
    }

    // Check if attempts remaining
    if (otpAttempts <= 0) {
      showAlert("Maximum attempts reached. Please request a new OTP.", "error");
      setCanResend(true);
      return;
    }

    setIsVerifyingOtp(true);
    try {
      await api.post("/auth/verify-otp", {
        email: values.email,
        otp: values.otp,
      });
      setOtpVerified(true);
      setOtpTimer(0); // Stop timer
      showAlert("Email verified successfully!", "success");
    } catch (err) {
      const remainingAttempts = otpAttempts - 1;
      setOtpAttempts(remainingAttempts);

      if (remainingAttempts > 0) {
        showAlert(
          `Invalid OTP. ${remainingAttempts} attempt${remainingAttempts > 1 ? "s" : ""} remaining.`,
          "error",
        );
      } else {
        showAlert(
          "Maximum attempts reached. Please request a new OTP.",
          "error",
        );
        setCanResend(true);
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      showAlert("Please verify your email with OTP first", "error");
      return;
    }

    if (values.password.length < 8) {
      showAlert("Password must be at least 8 characters", "error");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/signup", {
        name: values.name,
        email: values.email,
        password: values.password,
      });
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      showAlert("Account created successfully!", "success");
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      showAlert(err.response?.data?.message || "Signup failed", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-4 relative overflow-hidden"
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

          <p
            className="text-sm text-center"
            style={{ color: "var(--text-muted)" }}
          >
            Join Talkify and start chatting
          </p>
        </div>

        {/* Alert */}
        {alert.msg && <div
          className="absolute top-4 right-4 px-4 py-2 rounded-lg flex items-center gap-2 animate-slide-in shadow-lg z-50"
          style={{
              backgroundColor:
                alert.type === "success"
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(239,68,68,0.15)",
              color:
                alert.type === "success" ? "var(--success)" : "var(--danger)",
              border: `1px solid ${
                alert.type === "success"
                  ? "rgba(34,197,94,0.3)"
                  : "rgba(239,68,68,0.3)"
              }`,
            }}
        >
          {alert.type === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
          <span className="text-sm font-semibold">
            {alert.msg}
          </span>
        </div>}

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
                  color:
                    focusedField === "name"
                      ? "var(--accent-primary)"
                      : "var(--text-muted)",
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
                    focusedField === "name"
                      ? "var(--accent-primary)"
                      : "var(--border-input)"
                  }`,
                }}
              />
            </div>
          </div>

          {/* Email Field with Send OTP Button */}
          <div>
            <label
              className="text-sm font-medium mb-1 block"
              style={{ color: "var(--text-label)" }}
            >
              Email
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                  style={{
                    color:
                      focusedField === "email"
                        ? "var(--accent-primary)"
                        : "var(--text-muted)",
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
                  disabled={otpVerified}
                  className="w-full pl-11 pr-4 py-2 rounded-lg outline-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--bg-input)",
                    color: "var(--text-main)",
                    border: `2px solid ${
                      focusedField === "email"
                        ? "var(--accent-primary)"
                        : "var(--border-input)"
                    }`,
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={
                  isSendingOtp || otpVerified || (otpSent && !canResend)
                }
                className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: otpVerified
                    ? "var(--success)"
                    : "var(--accent-secondary)",
                  color: "#ffffff",
                }}
              >
                {isSendingOtp ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </span>
                ) : otpVerified ? (
                  "Verified ✓"
                ) : otpSent && !canResend ? (
                  formatTimer(otpTimer)
                ) : otpSent ? (
                  "Resend"
                ) : (
                  "Send OTP"
                )}
              </button>
            </div>
          </div>

          {/* OTP Field - Shows after OTP is sent */}
          {otpSent && !otpVerified && (
            <div>
              <label
                className="text-sm font-medium mb-1 block"
                style={{ color: "var(--text-label)" }}
              >
                Enter OTP
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Lock
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                    style={{
                      color:
                        focusedField === "otp"
                          ? "var(--accent-primary)"
                          : "var(--text-muted)",
                      transition: "color 0.2s",
                    }}
                  />
                  <input
                    type="text"
                    name="otp"
                    value={values.otp}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("otp")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    disabled={otpAttempts <= 0 && !canResend}
                    className="w-full pl-11 pr-4 py-2 rounded-lg outline-none transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: "var(--bg-input)",
                      color: "var(--text-main)",
                      border: `2px solid ${
                        focusedField === "otp"
                          ? "var(--accent-primary)"
                          : "var(--border-input)"
                      }`,
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={
                    isVerifyingOtp ||
                    !values.otp ||
                    values.otp.length !== 6 ||
                    otpAttempts <= 0 ||
                    otpTimer === 0
                  }
                  className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--accent-primary)",
                    color: "#020617",
                  }}
                >
                  {isVerifyingOtp ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    </span>
                  ) : (
                    "Verify"
                  )}
                </button>
              </div>

              {/* OTP Info Section */}
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span style={{ color: "var(--text-muted)" }}>
                    {otpTimer > 0 ? (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Expires in {formatTimer(otpTimer)}
                      </span>
                    ) : (
                      <span style={{ color: "var(--danger)" }}>
                        OTP expired. Click Resend.
                      </span>
                    )}
                  </span>
                  <span
                    style={{
                      color:
                        otpAttempts > 1
                          ? "var(--text-muted)"
                          : otpAttempts === 1
                            ? "#fbbf24"
                            : "var(--danger)",
                    }}
                  >
                    {otpAttempts} attempt{otpAttempts !== 1 ? "s" : ""} left
                  </span>
                </div>
                <p
                  className="text-xs opacity-60"
                  style={{ color: "var(--text-muted)" }}
                >
                  Check your email for the verification code
                </p>
              </div>
            </div>
          )}

          {/* Password Field - Only enabled after OTP verification */}
          {otpVerified && (
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
                    color:
                      focusedField === "password"
                        ? "var(--accent-primary)"
                        : "var(--text-muted)",
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
                      focusedField === "password"
                        ? "var(--accent-primary)"
                        : "var(--border-input)"
                    }`,
                  }}
                />
              </div>
              <p
                className="text-xs mt-2 opacity-60"
                style={{ color: "var(--text-muted)" }}
              >
                Must be at least 8 characters
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !otpVerified}
            className="w-full py-3 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "#020617",
            }}
            onMouseEnter={(e) => {
              if (!isLoading && otpVerified)
                e.currentTarget.style.transform = "translateY(-2px)";
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
            ) : !otpVerified ? (
              "Verify Email to Continue"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        {/* Terms and Privacy */}
        <p
          className="mt-4 text-center text-xs leading-relaxed"
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
          className="mt-3 text-center text-sm"
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
