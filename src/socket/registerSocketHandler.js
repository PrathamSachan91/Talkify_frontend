export const registerSocketHandlers = (socket, store) => {
  if (!socket) return;

  socket.on("online_users", (users) => {
    store.dispatch({
      type: "online/setAll",
      payload: users,
    });
  });

  socket.on("user_status", ({ userId, status }) => {
    store.dispatch({
      type: "online/update",
      payload: { userId, status },
    });
  });
};
