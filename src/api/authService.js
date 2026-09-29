// Versão simplificada da Iteração 1: usa localStorage em vez de uma API real.
// Para conectar a um back-end de verdade no futuro, troque as chamadas abaixo
// por requisições HTTP (veja o exemplo comentado no final do arquivo).

import { dbRegisterUser, dbLoginUser } from "./localDb";

// Caso de uso: Cadastrar-se
export async function registerUser({ name, email, password }) {
  return dbRegisterUser({ name, email, password });
}

// Caso de uso: Fazer login
export async function loginUser({ email, password }) {
  return dbLoginUser({ email, password });
}

// Caso de uso: Sair do sistema
export async function logoutUser() {
  // Nesta versão local não há sessão no servidor para invalidar;
  // a limpeza do token/usuário é feita no AuthContext.
  return Promise.resolve();
}

/* Exemplo de como ficaria com um back-end real (Node.js/Express):

import client from "./client";

export async function registerUser({ name, email, password }) {
  const { data } = await client.post("/auth/register", { name, email, password });
  return data;
}

export async function loginUser({ email, password }) {
  const { data } = await client.post("/auth/login", { email, password });
  return data;
}

export async function logoutUser() {
  await client.post("/auth/logout");
}
*/
