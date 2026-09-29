// Camada de persistência local (localStorage do navegador).
// Substitui, nesta versão simplificada, uma API REST + banco de dados real.
// Útil para demonstrar a aplicação funcionando sem depender de um back-end.
//
// IMPORTANTE: senhas ficam salvas em texto puro no navegador — isso é
// aceitável apenas para fins acadêmicos/demonstração, nunca em produção.

const USERS_KEY = "mytask_users";

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function delay(ms = 250) {
  // Pequeno atraso artificial só para simular uma chamada de rede
  // e manter os estados de "carregando" da interface visíveis.
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateId() {
  return (crypto.randomUUID && crypto.randomUUID()) || `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// ---------- Usuários ----------
export function getUsers() {
  return readJSON(USERS_KEY, []);
}

function saveUsers(users) {
  writeJSON(USERS_KEY, users);
}

export async function dbRegisterUser({ name, email, password }) {
  await delay();
  const users = getUsers();
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    const err = new Error("E-mail já cadastrado.");
    err.response = { data: { message: "Este e-mail já está cadastrado." } };
    throw err;
  }
  const newUser = { id: generateId(), name, email, password };
  users.push(newUser);
  saveUsers(users);
  return { id: newUser.id, name: newUser.name, email: newUser.email };
}

export async function dbLoginUser({ email, password }) {
  await delay();
  const users = getUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) {
    const err = new Error("Credenciais inválidas.");
    err.response = { data: { message: "E-mail ou senha inválidos." } };
    throw err;
  }
  const token = btoa(`${user.id}:${Date.now()}`);
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

// ---------- Tarefas (por usuário) ----------
function tasksKey(userId) {
  return `mytask_tasks_${userId}`;
}

function getCurrentUserId() {
  const stored = localStorage.getItem("mytask_user");
  if (!stored) return null;
  try {
    return JSON.parse(stored).id;
  } catch {
    return null;
  }
}

export async function dbGetTasks() {
  await delay();
  const userId = getCurrentUserId();
  return readJSON(tasksKey(userId), []);
}

export async function dbCreateTask(task) {
  await delay();
  const userId = getCurrentUserId();
  const tasks = readJSON(tasksKey(userId), []);
  const newTask = { id: generateId(), completed: false, ...task };
  tasks.unshift(newTask);
  writeJSON(tasksKey(userId), tasks);
  return newTask;
}

export async function dbUpdateTask(id, data) {
  await delay();
  const userId = getCurrentUserId();
  const tasks = readJSON(tasksKey(userId), []);
  const updated = tasks.map((t) => (t.id === id ? { ...t, ...data } : t));
  writeJSON(tasksKey(userId), updated);
  return updated.find((t) => t.id === id);
}

export async function dbCompleteTask(id) {
  await delay();
  const userId = getCurrentUserId();
  const tasks = readJSON(tasksKey(userId), []);
  const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
  writeJSON(tasksKey(userId), updated);
  return updated.find((t) => t.id === id);
}

export async function dbDeleteTask(id) {
  await delay();
  const userId = getCurrentUserId();
  const tasks = readJSON(tasksKey(userId), []);
  writeJSON(tasksKey(userId), tasks.filter((t) => t.id !== id));
}
