const express    = require('express');
const cors       = require('cors');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// 1. Health Check ตัวที่เข้าได้ชัวร์ๆ
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'TaskBoard API' });
});

// 2. API Routes หลัก
// มั่นใจว่าสะกดเป็นตัวพิมพ์เล็กทั้งหมด ไม่มีเว้นวรรค
app.use('/api/tasks', taskRoutes);

// 3. ตัวดักจับพิเศษ (ถ้าเรียกพาร์ทไหนแล้วขึ้น Cannot GET มันจะวิ่งมาตรงนี้แทน)
app.use((req, res) => {
  res.status(404).json({
    error: "หาเส้นทางนี้ไม่เจอในระบบ Express",
    requested_url: req.originalUrl,
    hint: "ลองเช็กไฟล์ taskRoutes.js อีกครั้งว่าได้เอาฟังก์ชัน getAllTasks ไปผูกไว้หรือยัง"
  });
});

module.exports = app;