// Montagem da aplicação Express (sem abrir porta — facilita os testes).
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { pool } = require("./config/db");
const { rotaNaoEncontrada, tratarErros } = require("./middlewares/tratarErros");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

// Verificação rápida de que a API e o banco estão respondendo.
app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "ok" });
  } catch {
    res.status(503).json({ status: "erro", database: "indisponível" });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(rotaNaoEncontrada);
app.use(tratarErros);

module.exports = app;
