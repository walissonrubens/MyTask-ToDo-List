import { useState } from "react";

const emptyTask = { title: "", description: "", dueDate: "", priority: "media" };

export default function TaskForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialData || emptyTask);
  const [error, setError] = useState("");
  const isEditing = !!initialData;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("O título da tarefa é obrigatório.");
      return;
    }
    setError("");
    onSubmit(form);
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>{isEditing ? "Editar Tarefa" : "Nova Tarefa"}</h3>

        {error && <div className="error-msg">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Título *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex.: Estudar para a prova"
              autoFocus
            />
          </div>

          <div className="field">
            <label>Descrição</label>
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
              placeholder="Detalhes da tarefa (opcional)"
            />
          </div>

          <div className="field">
            <label>Prazo</label>
            <input type="date" name="dueDate" value={form.dueDate || ""} onChange={handleChange} />
          </div>

          <div className="field">
            <label>Prioridade</label>
            <select name="priority" value={form.priority} onChange={handleChange}>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Salvar Alterações" : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
