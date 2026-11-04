// Repassa ao Express os erros lançados por funções assíncronas.
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
