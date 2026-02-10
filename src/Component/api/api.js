import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
// baseURL: "https://talkify-backend-q62n.onrender.com/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;