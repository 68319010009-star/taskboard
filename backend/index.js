require('dotenv').config();
const pool = require('./src/db');   // ✅ เปลี่ยนกลับเป็นตัวนี้ เพราะ db.js อยู่ใน src
const app  = require('./src/app');  // ✅ เปลี่ยนเป็นตัวนี้ เพราะเราจะยึดไฟล์ app.js ตัวหลัก

const PORT = process.env.PORT || 3001;

async function initDb() {
  // สร้าง table ถ้ายังไม่มี
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id          SERIAL PRIMARY KEY,
      title       VARCHAR(200) NOT NULL,
      description TEXT         DEFAULT '',
      status      VARCHAR(20)  NOT NULL DEFAULT 'todo',
      priority    VARCHAR(10)  NOT NULL DEFAULT 'medium',
      created_at  TIMESTAMPTZ  DEFAULT NOW(),
      updated_at  TIMESTAMPTZ  DEFAULT NOW()
    )
  `);
  console.log('✅ Table tasks ready');

  // Seed ถ้า table ว่าง
  const { rows } = await pool.query('SELECT COUNT(*) FROM tasks');
  if (parseInt(rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO tasks (title, description, status, priority) VALUES
      ('ติดตั้ง Docker Desktop',  'ดาวน์โหลดจาก docker.com และติดตั้ง', 'done',       'high'),
      ('สร้าง GitHub Repository', 'สร้าง repo ชื่อ taskboard',           'done',       'high'),
      ('เขียน Backend API',       'Express + PostgreSQL CRUD',             'inprogress', 'high'),
      ('เขียน Frontend Vue',      'Vue 3 + Vite แสดงรายการงาน',           'todo',       'medium'),
      ('สร้าง Dockerfile',        'Containerize backend และ frontend',     'todo',       'medium'),
      ('เขียน CI/CD Pipeline',    'GitHub Actions build + push image',     'todo',       'low')
    `);
    console.log('🌱 Seed data inserted (6 tasks)');
  }
}

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 TaskBoard API running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB init failed:', err.message);
    process.exit(1);
  });