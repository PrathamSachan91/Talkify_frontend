import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/AuthSlice";
import api from "../api/api";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    api.get("/auth/logout");
    dispatch(logout());
    queryClient.clear();
    navigate("/login");
  };

  return (
    <nav
      className="h-16 flex items-center justify-between px-8 border-b shadow-sm"
      style={{
        background:
          "linear-gradient(to right, var(--bg-gradient-start), var(--bg-gradient-mid))",
        borderColor: "var(--border-main)",
      }}
    >
      {/* Logo Section */}
      <div
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigate("/")}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-md transition-transform duration-200 group-hover:scale-110"
          style={{
            backgroundColor: "var(--accent-primary)",
          }}
        >
          💬
        </div>
        <div>
          <h1
            className="text-xl font-bold tracking-tight transition-colors duration-200"
            style={{ color: "var(--accent-primary)" }}
          >
            Talkify
          </h1>
          <p className="text-xs opacity-60" style={{ color: "var(--text-muted)" }}>
            Connect & Chat
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">
        {isAuthenticated && user ? (
          <>
            {/* User Info with Avatar */}
            <div className="flex items-center gap-3">
              <div
                className="hidden sm:flex flex-col items-end"
                style={{ color: "var(--text-main)" }}
              >
                <span className="text-sm font-semibold">{user.user_name}</span>
                <span className="text-xs opacity-60" style={{ color: "var(--text-muted)" }}>
                  Online
                </span>
              </div>
              
              {/* Avatar with Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: "var(--accent-secondary)",
                    color: "#020617",
                  }}
                >
                  {user.user_name.charAt(0).toUpperCase()}
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <>
                    {/* Backdrop to close dropdown */}
                    <div
                      className="fixed inset-0 z-10 "
                      onClick={() => setShowDropdown(false)}
                    ></div>
                    
                    <div
                      className="absolute right-0 mt-3 w-56 rounded-xl shadow-2xl overflow-hidden z-20 border"
                      style={{
                        backgroundColor: "var(--bg-card)",
                        borderColor: "var(--border-main)",
                      }}
                    >
                      {/* User Info in Dropdown */}
                      <div
                        className="px-4 py-2 border-b"
                        style={{ borderColor: "var(--border-main)" }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg"
                            style={{
                              backgroundColor: "var(--accent-secondary)",
                              color: "#020617",
                            }}
                          >
                            {user.user_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-semibold text-sm truncate"
                              style={{ color: "var(--text-main)" }}
                            >
                              {user.user_name}
                            </p>
                            <p className="text-xs opacity-60" style={{ color: "var(--text-muted)" }}>
                              {user.email || "Active now"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          className="w-full px-4 py-2.5 flex items-center gap-3 transition-colors duration-150"
                          style={{ color: "var(--text-main)" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(20, 184, 166, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                          onClick={() => {
                            navigate("/profile");
                            setShowDropdown(false);
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="text-sm font-medium">Profile</span>
                        </button>

                        <button
                          className="w-full px-4 py-2.5 flex items-center gap-3 transition-colors duration-150"
                          style={{ color: "var(--text-main)" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(20, 184, 166, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                          onClick={() => {
                            navigate("/settings");
                            setShowDropdown(false);
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <span className="text-sm font-medium">Settings</span>
                        </button>

                        <div
                          className="my-1 border-t"
                          style={{ borderColor: "var(--border-main)" }}
                        ></div>

                        <button
                          className="w-full px-4 py-2.5 flex items-center gap-3 transition-colors duration-150"
                          style={{ color: "var(--danger)" }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                          }}
                          onClick={() => {
                            handleLogout();
                            setShowDropdown(false);
                          }}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                          <span className="text-sm font-medium">Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick Logout Button (Desktop) */}
            <button
              className="hidden lg:flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
              style={{
                backgroundColor: "var(--danger)",
                color: "#FFFFFF",
              }}
              onClick={handleLogout}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = "0.9";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </>
        ) : (
          <button
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "#020617",
            }}
            onClick={() => navigate("/login")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;