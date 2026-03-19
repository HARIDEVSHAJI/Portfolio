import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to requests
api.interceptors.request.use((config) => {
  const token = Cookies.get("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("admin_token");
      if (typeof window !== "undefined" && window.location.pathname.startsWith("/admin")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);

// ─── Auth ────────────────────────────────────────────
export const login = async (username: string, password: string) => {
  const res = await api.post("/api/login", { username, password });
  return res.data;
};

// ─── Projects ────────────────────────────────────────
export const getProjects = () => api.get("/api/projects").then((r) => r.data);
export const createProject = (formData: FormData) =>
  api.post("/api/projects", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
export const updateProject = (id: number, formData: FormData) =>
  api.put(`/api/projects/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
export const deleteProject = (id: number) =>
  api.delete(`/api/projects/${id}`).then((r) => r.data);

export const uploadProjectImage = (projectId: number, file: File, order: number) => {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("order", order.toString());
  return api.post(`/api/projects/${projectId}/images`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
};
export const deleteProjectImage = (imageId: number) =>
  api.delete(`/api/projects/images/${imageId}`).then((r) => r.data);

// ─── Roles ───────────────────────────────────────────
export const getRoles = () => api.get("/api/roles").then((r) => r.data);
export const createRole = (data: Record<string, unknown>) =>
  api.post("/api/roles", data).then((r) => r.data);
export const updateRole = (id: number, data: Record<string, unknown>) =>
  api.put(`/api/roles/${id}`, data).then((r) => r.data);
export const deleteRole = (id: number) =>
  api.delete(`/api/roles/${id}`).then((r) => r.data);

// ─── Skills ──────────────────────────────────────────
export const getSkills = () => api.get("/api/skills").then((r) => r.data);
export const createSkill = (data: Record<string, unknown>) =>
  api.post("/api/skills", data).then((r) => r.data);
export const updateSkill = (id: number, data: Record<string, unknown>) =>
  api.put(`/api/skills/${id}`, data).then((r) => r.data);
export const deleteSkill = (id: number) =>
  api.delete(`/api/skills/${id}`).then((r) => r.data);

// ─── About ───────────────────────────────────────────
export const getAbout = () => api.get("/api/about").then((r) => r.data);
export const updateAbout = (data: Record<string, unknown>) =>
  api.put("/api/about", data).then((r) => r.data);
export const uploadProfileImage = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/api/about/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
};

// ─── Resume ──────────────────────────────────────────
export const getResume = () => api.get("/api/resume").then((r) => r.data);
export const uploadResume = (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  return api.post("/api/resume", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
};

// ─── Certificates ────────────────────────────────────
export const getCertificates = () => api.get("/api/certificates").then((r) => r.data);
export const createCertificate = (formData: FormData) =>
  api.post("/api/certificates", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then((r) => r.data);
export const deleteCertificate = (id: number) =>
  api.delete(`/api/certificates/${id}`).then((r) => r.data);

// ─── Contact ─────────────────────────────────────────
export const getContact = () => api.get("/api/contact").then((r) => r.data);
export const updateContact = (data: Record<string, unknown>) =>
  api.put("/api/contact", data).then((r) => r.data);

export default api;
