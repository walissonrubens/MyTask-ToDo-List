// Converte erros em respostas JSON no formato { message }.
function rotaNaoEncontrada(req, res) {
  res.status(404).json({ message: "Rota não encontrada." });
}

// eslint-disable-next-line no-unused-vars
function tratarErros(err, req, res, next) {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "JSON inválido no corpo da requisição." });
  }
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }
  console.error(err);
  return res.status(500).json({ message: "Erro interno no servidor. Tente novamente." });
}

module.exports = { rotaNaoEncontrada, tratarErros };
