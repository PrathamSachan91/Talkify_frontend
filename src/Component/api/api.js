import axios from "axios";

const api = axios.create({
  baseURL: "https:talkify-backend-q62n.onrender.com/api",
  withCredentials: true, // sends cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;