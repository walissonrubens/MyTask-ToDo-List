// UsuarioRepository — classe de entidade/persistência do Diagrama de Classes de Projeto.
const { pool } = require("../config/db");

function paraUsuario(linha) {
  if (!linha) return null;
  return { id: linha.id, name: linha.nome, email: linha.email, senhaHash: linha.senha_hash };
}

async function salvar({ name, email, senhaHash }) {
  const { rows } = await pool.query(
    "INSERT INTO usuarios (nome, email, senha_hash) VALUES ($1, $2, $3) RETURNING *",
    [name, email, senhaHash]
  );
  return paraUsuario(rows[0]);
}

async function buscarPorEmail(email) {
  const { rows } = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
  return paraUsuario(rows[0]);
}

module.exports = { salvar, buscarPorEmail };
