import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import TaskItem from "../components/TaskItem";
import TaskForm from "../components/TaskForm";
import ConfirmDialog from "../components/ConfirmDialog";
import { getTasks, createTask, updateTask, completeTask, deleteTask } from "../api/taskService";

const TABS = [
  { key: "pendentes", label: "Pendentes" },
  { key: "concluidas", label: "Concluídas" },
  { key: "atrasadas", label: "Atrasadas" },
  { key: "todas", label: "Todas" },
];

const SORT_OPTIONS = [
  { key: "recentes", label: "Mais recentes" },
  { key: "prazo", label: "Prazo (mais próximo)" },
  { key: "prioridade", label: "Prioridade (alta primeiro)" },
];

const PRIORITY_ORDER = { alta: 0, media: 1, baixa: 2 };

function sortTasks(list, sortBy) {
  const sorted = [...list];
  if (sortBy === "prazo") {
    // Tarefas sem prazo vão para o final da lista.
    sorted.sort((a, b) => (a.dueDate || "9999-12-31").localeCompare(b.dueDate || "9999-12-31"));
  } else if (sortBy === "prioridade") {
    sorted.sort((a, b) => (PRIORITY_ORDER[a.priority] ?? 3) - (PRIORITY_ORDER[b.priority] ?? 3));
  }
  return sorted; // "recentes": a API já devolve da mais nova para a mais antiga
}

function apiMessage(err, fallback) {
  return err.response?.data?.message || fallback;
}

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.dueDate + "T00:00:00") < today;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pendentes");
  const [sortBy, setSortBy] = useState("recentes");

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setLoading(true);
    setError("");
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError("Não foi possível carregar suas tarefas. Verifique sua conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  // Caso de uso: Criar tarefa / Editar tarefa
  // Erros de validação são exibidos dentro do próprio formulário (TaskForm).
  async function handleFormSubmit(formData) {
    const payload = {
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      priority: formData.priority,
    };
    if (editingTask) {
      const updated = await updateTask(editingTask.id, payload);
      setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? updated : t)));
    } else {
      const created = await createTask(payload);
      setTasks((prev) => [created, ...prev]);
    }
    setError("");
    closeForm();
  }

  // Caso de uso: Marcar tarefa como concluída
  async function handleToggleComplete(task) {
    try {
      const updated = await completeTask(task.id);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      setError(apiMessage(err, "Não foi possível atualizar o status da tarefa."));
    }
  }

  // Caso de uso: Excluir tarefa
  async function handleConfirmDelete() {
    if (!taskToDelete) return;
    try {
      await deleteTask(taskToDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
    } catch (err) {
      setError(apiMessage(err, "Não foi possível excluir a tarefa."));
    } finally {
      setTaskToDelete(null);
    }
  }

  function openCreateForm() {
    setEditingTask(null);
    setShowForm(true);
  }

  function openEditForm(task) {
    setEditingTask(task);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingTask(null);
  }

  const filteredTasks = sortTasks(
    tasks.filter((task) => {
      if (activeTab === "pendentes") return !task.completed && !isOverdue(task);
      if (activeTab === "concluidas") return !!task.completed;
      if (activeTab === "atrasadas") return isOverdue(task);
      return true;
    }),
    sortBy
  );

  return (
    <div>
      <Navbar />
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Minhas Tarefas</h2>
          <button className="btn btn-teal" onClick={openCreateForm}>
            + Nova Tarefa
          </button>
        </div>

        {error && <div className="error-msg">{error}</div>}

        <div className="toolbar">
          <div className="tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`tab ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <label className="sort-control">
            Ordenar por
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {loading ? (
          <div className="loading">Carregando tarefas...</div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">Nenhuma tarefa encontrada nesta categoria.</div>
        ) : (
          <div className="task-list">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={openEditForm}
                onDelete={setTaskToDelete}
              />
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <TaskForm initialData={editingTask} onSubmit={handleFormSubmit} onCancel={closeForm} />
      )}

      {taskToDelete && (
        <ConfirmDialog
          title="Excluir tarefa"
          message={`Tem certeza que deseja excluir "${taskToDelete.title}"? Essa ação não pode ser desfeita.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setTaskToDelete(null)}
        />
      )}
    </div>
  );
}
