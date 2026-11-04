// Cria as tabelas do MyTask no banco configurado em DATABASE_URL.
// Uso: npm run db:init
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("../src/config/db");

async function main() {
  const sql = fs.readFileSync(path.join(__dirname, "..", "db", "schema.sql"), "utf8");
  await pool.query(sql);
  console.log("Banco de dados inicializado com sucesso (tabelas usuarios e tarefas).");
}

main()
  .catch((err) => {
    console.error("Erro ao inicializar o banco de dados:", err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
