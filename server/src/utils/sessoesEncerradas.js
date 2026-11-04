// Guarda os identificadores (jti) dos tokens encerrados por logout,
// até o momento em que eles expirariam naturalmente.
// Observação: a lista fica em memória e é reiniciada junto com o servidor.
const encerradas = new Map(); // jti -> expiração (segundos, padrão JWT)

function limparExpiradas() {
  const agora = Math.floor(Date.now() / 1000);
  for (const [jti, exp] of encerradas) {
    if (exp <= agora) encerradas.delete(jti);
  }
}

function encerrar(jti, exp) {
  if (!jti) return;
  limparExpiradas();
  encerradas.set(jti, exp || Math.floor(Date.now() / 1000) + 24 * 60 * 60);
}

function estaEncerrada(jti) {
  return encerradas.has(jti);
}

module.exports = { encerrar, estaEncerrada };
