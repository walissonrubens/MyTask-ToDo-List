// Serviços de tarefas — chamam a API REST (Node.js/Express) do MyTask.
// O token JWT do usuário logado é anexado automaticamente pelo client.js.
import client from "./client";

// Caso de uso: Visualizar tarefas
export async function getTasks() {
  const { data } = await client.get("/tasks");
  return data;
}

// Caso de uso: Criar tarefa
export async function createTask(task) {
  const { data } = await client.post("/tasks", task);
  return data;
}

// Caso de uso: Editar tarefa
export async function updateTask(id, task) {
  const { data } = await client.put(`/tasks/${id}`, task);
  return data;
}

// Caso de uso: Marcar tarefa como concluída
export async function completeTask(id) {
  const { data } = await client.patch(`/tasks/${id}/complete`);
  return data;
}

// Caso de uso: Excluir tarefa
export async function deleteTask(id) {
  await client.delete(`/tasks/${id}`);
}
