const { Router } = require("express");
const controller = require("../controllers/autenticacaoController");
const autenticar = require("../middlewares/autenticar");
const assincrono = require("../utils/assincrono");

const router = Router();

router.post("/register", assincrono(controller.cadastrar));
router.post("/login", assincrono(controller.autenticar));
router.post("/logout", autenticar, assincrono(controller.logout));

module.exports = router;
