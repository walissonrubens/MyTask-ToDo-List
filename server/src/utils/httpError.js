// Erro com código HTTP, convertido em resposta JSON pelo middleware errorHandler.
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

module.exports = HttpError;
