const pool = require('../db');

// ดึงข้อมูลทั้งหมดแบบ Simple ที่สุด
const getAllTasks = async (req, res) => {
  try {
    console.log("📥 กำลังเรียกฟังก์ชัน getAllTasks...");
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    console.log(`📤 ดึงข้อมูลสำเร็จ! พบทั้งหมด ${rows.length} รายการ`);
    return res.json(rows);
  } catch (err) {
    console.error("❌ Controller Error:", err.message);
    return res.status(500).json({ error: err.message, location: "getAllTasks" });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'ไม่พบงานนี้' });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description = '', status = 'todo', priority = 'medium' } = req.body;
    if (!title) return res.status(400).json({ error: 'กรุณาระบุ title' });
    const { rows } = await pool.query(
      `INSERT INTO tasks (title, description, status, priority) VALUES ($1, $2, $3, $4) RETURNING *`,
      [title.trim(), description.trim(), status, priority]
    );
    return res.status(201).json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description = '', status = 'todo', priority = 'medium' } = req.body;
    const { rows } = await pool.query(
      `UPDATE tasks SET title=$1, description=$2, status=$3, priority=$4, updated_at=NOW() WHERE id=$5 RETURNING *`,
      [title, description, status, priority, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'ไม่พบงานนี้' });
    return res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM tasks WHERE id=$1 RETURNING *', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'ไม่พบงานนี้' });
    return res.json({ message: 'ลบงานสำเร็จ', deleted: rows[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };