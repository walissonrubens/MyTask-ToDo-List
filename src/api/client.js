import axios from "axios";

// URL base da API REST (Node.js/Express), conforme o Diagrama de Implantação.
// Configure VITE_API_URL no arquivo .env (veja .env.example).
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const client = axios.create({ baseURL });

// Anexa o token JWT (obtido no login) em toda requisição autenticada.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("mytask_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Se o backend responder 401 (sessão expirada/inválida), limpa a sessão local.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("mytask_token");
      localStorage.removeItem("mytask_user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default client;
