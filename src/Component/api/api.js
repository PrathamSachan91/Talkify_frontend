import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL,
  withCredentials: true, // sends cookies automatically
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;