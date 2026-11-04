// TarefaController — casos de uso Criar, Visualizar, Editar, Concluir e Excluir Tarefa.
const tarefaRepository = require("../repositories/tarefaRepository");
const HttpError = require("../utils/httpError");
const { validarTarefa, validarId } = require("../utils/validators");

// Garante que a tarefa existe e pertence ao usuário autenticado.
async function buscarTarefaDoUsuario(req) {
  const id = validarId(req.params.id);
  const tarefa = await tarefaRepository.buscarPorId(id);
  if (!tarefa) {
    throw new HttpError(404, "Tarefa não encontrada.");
  }
  if (tarefa.userId !== req.auth.userId) {
    throw new HttpError(403, "Acesso negado: esta tarefa pertence a outro usuário.");
  }
  return tarefa;
}

function dadosDaTarefa(body = {}) {
  return {
    title: body.title,
    description: body.description,
    dueDate: body.dueDate,
    priority: body.priority,
  };
}

// GET /api/tasks
async function listar(req, res) {
  const tarefas = await tarefaRepository.buscarPorUsuario(req.auth.userId);
  res.json(tarefas);
}

// POST /api/tasks
async function criar(req, res) {
  const dados = dadosDaTarefa(req.body);
  validarTarefa(dados);
  const tarefa = await tarefaRepository.salvar(req.auth.userId, dados);
  res.status(201).json(tarefa);
}

// PUT /api/tasks/:id
async function editar(req, res) {
  const atual = await buscarTarefaDoUsuario(req);
  const dados = dadosDaTarefa(req.body);
  validarTarefa(dados, { prazoAnterior: atual.dueDate });
  const tarefa = await tarefaRepository.atualizar(atual.id, dados);
  res.json(tarefa);
}

// PATCH /api/tasks/:id/complete
// Marca a tarefa como concluída (registrando a data de conclusão).
// Se ela já estiver concluída, a ação a reabre como pendente.
async function concluir(req, res) {
  const atual = await buscarTarefaDoUsuario(req);
  const tarefa = await tarefaRepository.alterarStatus(atual.id, !atual.completed);
  res.json(tarefa);
}

// DELETE /api/tasks/:id
async function excluir(req, res) {
  const atual = await buscarTarefaDoUsuario(req);
  await tarefaRepository.remover(atual.id);
  res.status(204).end();
}

module.exports = { listar, criar, editar, concluir, excluir };
