import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  // baseURL: process.env.REACT_APP_API_URL, // якщо CRA
  withCredentials: true,
});

export default api;
