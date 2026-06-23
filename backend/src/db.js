const { Pool } = require('pg');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const pool = new Pool({
  host:     process.env.DB_HOST,
  port:     process.env.DB_PORT,
  database: process.env.DB_NAME,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('❌ DB connection failed:', err.message);
  else     console.log('✅ DB connected at:', res.rows[0].now);
});

module.exports = pool;