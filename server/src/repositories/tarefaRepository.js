// TarefaRepository — classe de entidade/persistência do Diagrama de Classes de Projeto.
const { pool } = require("../config/db");

// Converte uma linha da tabela "tarefas" no formato usado pela API/front-end.
function paraTarefa(linha) {
  if (!linha) return null;
  return {
    id: linha.id,
    userId: linha.usuario_id,
    title: linha.titulo,
    description: linha.descricao || "",
    dueDate: linha.prazo || "",
    priority: linha.prioridade,
    status: linha.status,
    completed: linha.status === "concluida",
    completedAt: linha.data_conclusao,
    createdAt: linha.criado_em,
    updatedAt: linha.atualizado_em,
  };
}

async function salvar(usuarioId, { title, description, dueDate, priority }) {
  const { rows } = await pool.query(
    `INSERT INTO tarefas (usuario_id, titulo, descricao, prazo, prioridade)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [usuarioId, title.trim(), description || null, dueDate || null, priority || "media"]
  );
  return paraTarefa(rows[0]);
}

async function buscarPorUsuario(usuarioId) {
  const { rows } = await pool.query(
    "SELECT * FROM tarefas WHERE usuario_id = $1 ORDER BY criado_em DESC, id DESC",
    [usuarioId]
  );
  return rows.map(paraTarefa);
}

async function buscarPorId(id) {
  const { rows } = await pool.query("SELECT * FROM tarefas WHERE id = $1", [id]);
  return paraTarefa(rows[0]);
}

async function atualizar(id, { title, description, dueDate, priority }) {
  const { rows } = await pool.query(
    `UPDATE tarefas
        SET titulo = $2, descricao = $3, prazo = $4, prioridade = $5, atualizado_em = NOW()
      WHERE id = $1
      RETURNING *`,
    [id, title.trim(), description || null, dueDate || null, priority || "media"]
  );
  return paraTarefa(rows[0]);
}

// concluida = true registra a data de conclusão; false reabre a tarefa.
async function alterarStatus(id, concluida) {
  const { rows } = await pool.query(
    `UPDATE tarefas
        SET status = $2,
            data_conclusao = CASE WHEN $3::boolean THEN NOW() ELSE NULL END,
            atualizado_em = NOW()
      WHERE id = $1
      RETURNING *`,
    [id, concluida ? "concluida" : "pendente", concluida]
  );
  return paraTarefa(rows[0]);
}

async function remover(id) {
  await pool.query("DELETE FROM tarefas WHERE id = $1", [id]);
}

module.exports = { salvar, buscarPorUsuario, buscarPorId, atualizar, alterarStatus, remover };
