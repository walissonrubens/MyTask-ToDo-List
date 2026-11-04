const HttpError = require("./httpError");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PRIORIDADES = ["baixa", "media", "alta"];

function hojeISO() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

function dataValida(texto) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(texto)) return false;
  const d = new Date(`${texto}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === texto;
}

// Regras do caso de uso "Cadastrar-se"
function validarCadastro({ name, email, password }) {
  if (!name || !String(name).trim() || !email || !password) {
    throw new HttpError(400, "Preencha nome, e-mail e senha.");
  }
  if (String(name).trim().length > 100) {
    throw new HttpError(400, "O nome deve ter no máximo 100 caracteres.");
  }
  if (!EMAIL_REGEX.test(String(email).trim())) {
    throw new HttpError(400, "Informe um e-mail válido.");
  }
  if (String(password).length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    throw new HttpError(400, "A senha deve ter no mínimo 8 caracteres, com letras e números.");
  }
}

// Regras dos casos de uso "Criar Tarefa" e "Editar Tarefa".
// prazoAnterior: prazo já salvo — na edição, manter um prazo que já passou é permitido.
function validarTarefa({ title, description, dueDate, priority }, { prazoAnterior } = {}) {
  if (!title || !String(title).trim()) {
    throw new HttpError(400, "O título da tarefa é obrigatório.");
  }
  if (String(title).trim().length > 150) {
    throw new HttpError(400, "O título deve ter no máximo 150 caracteres.");
  }
  if (description && String(description).length > 2000) {
    throw new HttpError(400, "A descrição deve ter no máximo 2000 caracteres.");
  }
  if (priority && !PRIORIDADES.includes(priority)) {
    throw new HttpError(400, "Prioridade inválida. Use baixa, media ou alta.");
  }
  if (dueDate) {
    if (!dataValida(dueDate)) {
      throw new HttpError(400, "Prazo inválido. Informe uma data no formato AAAA-MM-DD.");
    }
    if (dueDate < hojeISO() && dueDate !== prazoAnterior) {
      throw new HttpError(400, "O prazo não pode ser uma data no passado.");
    }
  }
}

function validarId(valor) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(404, "Tarefa não encontrada.");
  }
  return id;
}

module.exports = { validarCadastro, validarTarefa, validarId };
