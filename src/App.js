import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./Component/Login/login";
import Static from "./Component/Static/Static";
import Landing from "./Component/Landing/Landing";
import "./Component/theme.css";
import Signin from "./Component/Signin/Signin";
import ChatDashboard from "./Component/Chat/ChatDashboard";
import ImageView from "./Component/Chat/imageView";
import EditProfile from "./Component/EditProfile/editProfile";
import { useSocket } from "./socket/socketContext";
import { useDispatch, useStore } from "react-redux";
import { useEffect } from "react";
import { registerSocketHandlers } from "./socket/registerSocketHandler";
import ChatGallery from "./Component/Chat/chatGallery";
import AdminDashboard from "./Component/Dashboard/admin";
import { ProtectedRoute, AdminRoute, PublicRoute } from "./Component/Routes/ProtectedRoute";
import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "./Component/Tanstack/Credential";
import { setUser, logout } from "./Component/redux/AuthSlice";

function App() {
  const socket = useSocket();
  const store = useStore();
  const dispatch = useDispatch();

  // ── Session check — runs once at root, before any route renders ──
  const { data, isError } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
    staleTime: Infinity, // Static reuses this — no double fetch
  });

  useEffect(() => {
    if (data) dispatch(setUser({ user: data }));
    if (isError) dispatch(logout());
  }, [data, isError, dispatch]);

  useEffect(() => {
    if (!socket) return;
    registerSocketHandlers(socket, store);
  }, [socket, store]);

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        {/* ── Public-only: redirects logged-in users to / ── */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/Signin" element={<Signin />} />
        </Route>

        {/* ── Shell layout ── */}
        <Route element={<Static />}>
          <Route path="/" element={<Landing />} />

          {/* Must be logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="/chat/:conversationId" element={<ChatDashboard />} />
            <Route path="/image-view" element={<ImageView />} />
            <Route path="/editProfile" element={<EditProfile />} />
            <Route path="/gallery/:conversationId" element={<ChatGallery />} />
          </Route>

          {/* Must be logged in + role === "admin" */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;