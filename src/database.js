require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // necessário em bancos na nuvem
});

function query(texto, parametros) {
  return pool.query(texto, parametros);
}

module.exports = { query };