// Serviços de autenticação — chamam a API REST (Node.js/Express) do MyTask.
import client from "./client";

// Caso de uso: Cadastrar-se
export async function registerUser({ name, email, password }) {
  const { data } = await client.post("/auth/register", { name, email, password });
  return data;
}

// Caso de uso: Fazer login
export async function loginUser({ email, password }) {
  const { data } = await client.post("/auth/login", { email, password });
  return data; // { token, user }
}

// Caso de uso: Sair do sistema — o servidor invalida o token atual.
export async function logoutUser() {
  await client.post("/auth/logout");
}
