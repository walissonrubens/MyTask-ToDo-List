import { useState } from "react";

const emptyTask = { title: "", description: "", dueDate: "", priority: "media" };

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function TaskForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState(initialData || emptyTask);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const isEditing = !!initialData;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("O título da tarefa é obrigatório.");
      return;
    }
    if (!isEditing && form.dueDate && form.dueDate < todayISO()) {
      setError("O prazo não pode ser uma data no passado.");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await onSubmit(form);
    } catch (err) {
      // Mensagem de validação devolvida pela API (ex.: prazo inválido).
      setError(err.response?.data?.message || "Não foi possível salvar a tarefa. Tente novamente.");
    } finally {
      setSaving(false);
    }
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
            <input
              type="date"
              name="dueDate"
              value={form.dueDate || ""}
              min={isEditing ? undefined : todayISO()}
              onChange={handleChange}
            />
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
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Salvando..." : isEditing ? "Salvar Alterações" : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
