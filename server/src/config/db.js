const { Pool, types } = require("pg");

// Colunas DATE (tipo 1082) são devolvidas como texto "AAAA-MM-DD",
// evitando deslocamentos de fuso horário ao converter para Date.
types.setTypeParser(1082, (value) => value);

if (!process.env.DATABASE_URL) {
  console.warn("Aviso: DATABASE_URL não definida. Copie server/.env.example para server/.env.");
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = { pool };
