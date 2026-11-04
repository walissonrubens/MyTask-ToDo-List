// Testes automatizados da API, baseados no Plano de Testes (TST-001 a TST-008).
// Requer o PostgreSQL configurado em DATABASE_URL e as tabelas criadas (npm run db:init).
// Uso: npm test
require("dotenv").config();
const { test, after } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../src/app");
const { pool } = require("../src/config/db");

const sufixo = Date.now();
const usuarioA = { name: "Usuário Teste", email: `teste.a.${sufixo}@example.com`, password: "senha1234" };
const usuarioB = { name: "Outro Usuário", email: `teste.b.${sufixo}@example.com`, password: "senha5678" };

function amanha() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function login(usuario) {
  const res = await request(app).post("/api/auth/login").send(usuario);
  return res.body.token;
}

after(async () => {
  await pool.query("DELETE FROM usuarios WHERE email IN ($1, $2)", [usuarioA.email, usuarioB.email]);
  await pool.end();
});

test("TST-001 – Cadastrar-se: válido, e-mail duplicado e senha fraca", async () => {
  const ok = await request(app).post("/api/auth/register").send(usuarioA);
  assert.equal(ok.status, 201);
  assert.equal(ok.body.email, usuarioA.email);
  assert.equal(ok.body.senhaHash, undefined);

  const duplicado = await request(app).post("/api/auth/register").send(usuarioA);
  assert.equal(duplicado.status, 409);

  const fraca = await request(app)
    .post("/api/auth/register")
    .send({ ...usuarioB, password: "123" });
  assert.equal(fraca.status, 400);

  const ok2 = await request(app).post("/api/auth/register").send(usuarioB);
  assert.equal(ok2.status, 201);
});

test("TST-002 – Fazer Login: credenciais válidas e inválidas", async () => {
  const ok = await request(app).post("/api/auth/login").send(usuarioA);
  assert.equal(ok.status, 200);
  assert.ok(ok.body.token);

  const errada = await request(app)
    .post("/api/auth/login")
    .send({ email: usuarioA.email, password: "senhaErrada1" });
  assert.equal(errada.status, 401);
});

test("TST-003 a TST-007 – CRUD de tarefas com validações e controle de acesso", async () => {
  const tokenA = await login(usuarioA);
  const tokenB = await login(usuarioB);
  const auth = (t) => ({ Authorization: `Bearer ${t}` });

  // TST-004: lista vazia
  const vazia = await request(app).get("/api/tasks").set(auth(tokenA));
  assert.equal(vazia.status, 200);
  assert.deepEqual(vazia.body, []);

  // TST-003: criar tarefa válida, sem título e com prazo no passado
  const nova = {
    title: "Entregar atividade de Estrutura de Dados",
    description: "Finalizar e revisar o trabalho da faculdade",
    dueDate: amanha(),
    priority: "alta",
  };
  const criada = await request(app).post("/api/tasks").set(auth(tokenA)).send(nova);
  assert.equal(criada.status, 201);
  assert.equal(criada.body.title, nova.title);
  assert.equal(criada.body.dueDate, nova.dueDate);
  assert.equal(criada.body.completed, false);

  const semTitulo = await request(app).post("/api/tasks").set(auth(tokenA)).send({ ...nova, title: " " });
  assert.equal(semTitulo.status, 400);

  const passado = await request(app).post("/api/tasks").set(auth(tokenA)).send({ ...nova, dueDate: "2020-01-01" });
  assert.equal(passado.status, 400);

  // TST-004: lista com a tarefa criada
  const lista = await request(app).get("/api/tasks").set(auth(tokenA));
  assert.equal(lista.body.length, 1);

  const id = criada.body.id;

  // TST-005: editar válida, dados inválidos e tarefa de outro usuário
  const editada = await request(app)
    .put(`/api/tasks/${id}`)
    .set(auth(tokenA))
    .send({ ...nova, title: "Revisar atividade", priority: "media" });
  assert.equal(editada.status, 200);
  assert.equal(editada.body.title, "Revisar atividade");

  const invalida = await request(app).put(`/api/tasks/${id}`).set(auth(tokenA)).send({ ...nova, priority: "urgente" });
  assert.equal(invalida.status, 400);

  const deOutro = await request(app).put(`/api/tasks/${id}`).set(auth(tokenB)).send(nova);
  assert.equal(deOutro.status, 403);

  // TST-006: concluir registra a data de conclusão
  const concluida = await request(app).patch(`/api/tasks/${id}/complete`).set(auth(tokenA));
  assert.equal(concluida.status, 200);
  assert.equal(concluida.body.completed, true);
  assert.ok(concluida.body.completedAt);

  // TST-007: excluir e tentar excluir novamente (inexistente)
  const excluida = await request(app).delete(`/api/tasks/${id}`).set(auth(tokenA));
  assert.equal(excluida.status, 204);

  const inexistente = await request(app).delete(`/api/tasks/${id}`).set(auth(tokenA));
  assert.equal(inexistente.status, 404);
});

test("TST-008 – Sair do sistema: o token deixa de valer após o logout", async () => {
  const token = await login(usuarioA);
  const auth = { Authorization: `Bearer ${token}` };

  const antes = await request(app).get("/api/tasks").set(auth);
  assert.equal(antes.status, 200);

  const sair = await request(app).post("/api/auth/logout").set(auth);
  assert.equal(sair.status, 204);

  const depois = await request(app).get("/api/tasks").set(auth);
  assert.equal(depois.status, 401);

  const semToken = await request(app).get("/api/tasks");
  assert.equal(semToken.status, 401);
});
