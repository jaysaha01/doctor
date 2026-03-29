import api from "./axios";

export const getDoctors = (params) => api.get("/doctors", { params });
export const getDoctorById = (id) => api.get(`/doctors/${id}`);
