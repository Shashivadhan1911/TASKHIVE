import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (userData) => api.post("/auth/login", userData),
  getProfile: () => api.get("/auth/profile"),
};

// Boards API
export const boardsAPI = {
  getBoards: () => api.get("/boards"),
  getBoard: (id) => api.get(`/boards/${id}`),
  createBoard: (boardData) => api.post("/boards", boardData),
  updateBoard: (id, boardData) => api.put(`/boards/${id}`, boardData),
  deleteBoard: (id) => api.delete(`/boards/${id}`),
};

// Tasks API
export const tasksAPI = {
  getTasksByBoard: (boardId) => api.get(`/tasks/board/${boardId}`),
  createTask: (taskData) => api.post("/tasks", taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  moveTask: (id, moveData) => api.put(`/tasks/${id}/move`, moveData),
};

// Comments API
export const commentsAPI = {
  getCommentsByTask: (taskId) => api.get(`/comments/task/${taskId}`),
  createComment: (commentData) => api.post("/comments", commentData),
  updateComment: (id, commentData) => api.put(`/comments/${id}`, commentData),
  deleteComment: (id) => api.delete(`/comments/${id}`),
};

export default api;
