const { Router } = require("express");
const controller = require("../controllers/tarefaController");
const autenticar = require("../middlewares/autenticar");
const assincrono = require("../utils/assincrono");

const router = Router();

// Todas as rotas de tarefas exigem usuário autenticado.
router.use(autenticar);

router.get("/", assincrono(controller.listar));
router.post("/", assincrono(controller.criar));
router.put("/:id", assincrono(controller.editar));
router.patch("/:id/complete", assincrono(controller.concluir));
router.delete("/:id", assincrono(controller.excluir));

module.exports = router;
