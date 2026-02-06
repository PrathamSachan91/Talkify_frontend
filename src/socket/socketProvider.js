import { useEffect } from "react";
import { useSelector } from "react-redux";
import socket from "./socket";
import { SocketContext } from "./socketContext";

const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      if (socket.connected) {
        socket.disconnect();
      }
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("🟢 socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ socket error:", err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
