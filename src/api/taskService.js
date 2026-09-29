// Versão simplificada da Iteração 1: usa localStorage em vez de uma API real.
// Para conectar a um back-end de verdade no futuro, troque as chamadas abaixo
// por requisições HTTP (veja o exemplo comentado no final do arquivo).

import { dbGetTasks, dbCreateTask, dbUpdateTask, dbCompleteTask, dbDeleteTask } from "./localDb";

// Caso de uso: Visualizar tarefas
export async function getTasks() {
  return dbGetTasks();
}

// Caso de uso: Criar tarefa
export async function createTask(task) {
  return dbCreateTask(task);
}

// Caso de uso: Editar tarefa
export async function updateTask(id, task) {
  return dbUpdateTask(id, task);
}

// Caso de uso: Marcar tarefa como concluída
export async function completeTask(id) {
  return dbCompleteTask(id);
}

// Caso de uso: Excluir tarefa
export async function deleteTask(id) {
  return dbDeleteTask(id);
}

/* Exemplo de como ficaria com um back-end real (Node.js/Express):

import client from "./client";

export async function getTasks() {
  const { data } = await client.get("/tasks");
  return data;
}

export async function createTask(task) {
  const { data } = await client.post("/tasks", task);
  return data;
}

export async function updateTask(id, task) {
  const { data } = await client.put(`/tasks/${id}`, task);
  return data;
}

export async function completeTask(id) {
  const { data } = await client.patch(`/tasks/${id}/complete`);
  return data;
}

export async function deleteTask(id) {
  await client.delete(`/tasks/${id}`);
}
*/
