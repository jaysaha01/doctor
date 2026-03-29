import api from "./axios";

export const registerUser = (data) => api.post("/register", data);
export const loginUser = (data) => api.post("/login", data);
export const getMe = () => api.get("/me");
export const verifyEmail = (token) => api.get(`/verify-email?token=${token}`);
