import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchMe } from "../Tanstack/Credential";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import SideBar from "../Sidebar/Sidebar";
import { setUser, logout } from "../redux/AuthSlice";

function Static() {
  const dispatch = useDispatch();
  const user=useSelector((state)=>state.auth.user);

  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      dispatch(setUser({ user: data }));
    }
    else {
      dispatch(logout());
    }
  }, [data,  dispatch]);

  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <div className="loader" />
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Loading your workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col min-w-[748px]">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {user && <SideBar />}
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default Static;
