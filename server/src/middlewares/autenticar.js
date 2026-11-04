// Exige um token JWT válido no cabeçalho "Authorization: Bearer <token>".
const jwt = require("jsonwebtoken");
const HttpError = require("../utils/httpError");
const sessoes = require("../utils/sessoesEncerradas");
const { JWT_SECRET } = require("../controllers/autenticacaoController");

function autenticar(req, res, next) {
  const [tipo, token] = (req.headers.authorization || "").split(" ");
  if (tipo !== "Bearer" || !token) {
    return next(new HttpError(401, "Faça login para continuar."));
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET());
    if (sessoes.estaEncerrada(payload.jti)) {
      return next(new HttpError(401, "Sessão encerrada. Faça login novamente."));
    }
    req.auth = { userId: Number(payload.sub), jti: payload.jti, exp: payload.exp };
    return next();
  } catch {
    return next(new HttpError(401, "Sessão inválida ou expirada. Faça login novamente."));
  }
}

module.exports = autenticar;
