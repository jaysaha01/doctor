import api from "./axios";

export const bookAppointment = (data) => api.post("/appointments", data);
export const getMyAppointments = () => api.get("/my-appointments");
export const getAllAppointments = (params) => api.get("/all-appointments", { params });
export const cancelAppointment = (id) => api.patch(`/appointments/${id}/cancel`);
