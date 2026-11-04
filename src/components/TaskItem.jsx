function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR");
}

const PRIORITY_LABELS = { baixa: "Baixa", media: "Média", alta: "Alta" };

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(task.dueDate + "T00:00:00") < today;
}

export default function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
  const overdue = isOverdue(task);

  return (
    <div className={`task-card ${task.completed ? "completed" : ""}`}>
      <input
        type="checkbox"
        className="checkbox"
        checked={!!task.completed}
        onChange={() => onToggleComplete(task)}
        title="Marcar como concluída"
      />

      <div className="content">
        <p className="title">{task.title}</p>
        {task.description && <p className="description">{task.description}</p>}

        <div className="task-meta">
          {task.priority && (
            <span className={`badge badge-priority-${task.priority}`}>
              Prioridade: {PRIORITY_LABELS[task.priority] || task.priority}
            </span>
          )}
          {task.dueDate && (
            <span className={`badge ${overdue ? "badge-overdue" : ""}`}>
              {overdue ? "Atrasada — " : "Prazo: "}
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button className="icon-btn edit" title="Editar" onClick={() => onEdit(task)}>
          ✏️
        </button>
        <button className="icon-btn delete" title="Excluir" onClick={() => onDelete(task)}>
          🗑️
        </button>
      </div>
    </div>
  );
}
