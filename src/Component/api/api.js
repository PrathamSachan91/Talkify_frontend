import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:3001/api",
  baseURL: import.meta.env.VITE_API_URL + "/api",
  withCredentials: true, // sends cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;