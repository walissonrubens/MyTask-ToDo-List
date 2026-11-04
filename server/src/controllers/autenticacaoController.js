// AutenticacaoController — casos de uso Cadastrar-se, Fazer Login e Sair do Sistema.
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const usuarioRepository = require("../repositories/usuarioRepository");
const HttpError = require("../utils/httpError");
const { validarCadastro } = require("../utils/validators");
const sessoes = require("../utils/sessoesEncerradas");

const JWT_SECRET = () => process.env.JWT_SECRET || "mytask-chave-de-desenvolvimento";
const JWT_EXPIRES_IN = () => process.env.JWT_EXPIRES_IN || "8h";

function semSenha(usuario) {
  return { id: usuario.id, name: usuario.name, email: usuario.email };
}

// POST /api/auth/register
async function cadastrar(req, res) {
  const { name, email, password } = req.body || {};
  validarCadastro({ name, email, password });

  const emailNormalizado = String(email).trim().toLowerCase();
  if (await usuarioRepository.buscarPorEmail(emailNormalizado)) {
    throw new HttpError(409, "Este e-mail já está cadastrado.");
  }

  const senhaHash = await bcrypt.hash(password, 10);
  const usuario = await usuarioRepository.salvar({
    name: String(name).trim(),
    email: emailNormalizado,
    senhaHash,
  });
  res.status(201).json(semSenha(usuario));
}

// POST /api/auth/login
async function autenticar(req, res) {
  const { email, password } = req.body || {};
  if (!email || !password) {
    throw new HttpError(400, "Informe e-mail e senha.");
  }

  const usuario = await usuarioRepository.buscarPorEmail(String(email).trim().toLowerCase());
  const senhaConfere = usuario && (await bcrypt.compare(password, usuario.senhaHash));
  if (!senhaConfere) {
    throw new HttpError(401, "E-mail ou senha inválidos.");
  }

  const token = jwt.sign({ sub: usuario.id, name: usuario.name }, JWT_SECRET(), {
    expiresIn: JWT_EXPIRES_IN(),
    jwtid: crypto.randomUUID(),
  });
  res.json({ token, user: semSenha(usuario) });
}

// POST /api/auth/logout — encerra a sessão: o token deixa de ser aceito.
async function logout(req, res) {
  sessoes.encerrar(req.auth.jti, req.auth.exp);
  res.status(204).end();
}

module.exports = { cadastrar, autenticar, logout, JWT_SECRET };
