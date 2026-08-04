<template>
  <div class="container">
    <h1>📋 TaskBoard</h1>

    <!-- Form เพิ่มงาน -->
    <div class="add-form">
      <input v-model="newTitle" placeholder="ชื่องาน..." @keyup.enter="addTask" />
      <select v-model="newPriority">
        <option value="low">Low</option>
        <option value="medium" selected>Medium</option>
        <option value="high">High</option>
      </select>
      <button @click="addTask">+ เพิ่มงาน</button>
    </div>

    <!-- Filter -->
    <div class="filter-bar">
      <select v-model="filterStatus" @change="loadTasks">
        <option value="">ทุกสถานะ</option>
        <option value="todo">Todo</option>
        <option value="inprogress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>

    <!-- รายการงาน -->
    <div v-if="loading" class="loading">กำลังโหลด...</div>
    <div v-else class="task-list">
      <div v-for="task in tasks" :key="task.id" class="task-card" :class="task.priority">
        <div class="task-info">
          <span class="priority-badge">{{ task.priority }}</span>
          <h3>{{ task.title }}</h3>
          <p v-if="task.description">{{ task.description }}</p>
        </div>
        <div class="task-actions">
          <select :value="task.status" @change="changeStatus(task, $event.target.value)">
            <option value="todo">Todo</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button class="del-btn" @click="deleteTask(task.id)">ลบ</button>
        </div>
      </div>
      <p v-if="tasks.length === 0" class="empty">ไม่มีงาน</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const tasks        = ref([])
const loading      = ref(false)
const newTitle     = ref('')
const newPriority  = ref('medium')
const filterStatus = ref('')

async function loadTasks() {
  loading.value = true
  const params = filterStatus.value ? `?status=${filterStatus.value}` : ''
  const res    = await fetch(`${API}/api/tasks${params}`)
  tasks.value  = await res.json()
  loading.value = false
}

async function addTask() {
  if (!newTitle.value.trim()) return
  await fetch(`${API}/api/tasks`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ title: newTitle.value, priority: newPriority.value }),
  })
  newTitle.value = ''
  loadTasks()
}

async function changeStatus(task, status) {
  await fetch(`${API}/api/tasks/${task.id}`, {
    method:  'PUT',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ ...task, status }),
  })
  loadTasks()
}

async function deleteTask(id) {
  if (!confirm('ลบงานนี้?')) return
  await fetch(`${API}/api/tasks/${id}`, { method: 'DELETE' })
  loadTasks()
}

onMounted(loadTasks)
</script>

<style scoped>
.container { max-width: 700px; margin: 2rem auto; padding: 0 1rem; font-family: sans-serif; }
h1 { font-size: 1.8rem; margin-bottom: 1.5rem; }
.add-form { display: flex; gap: .5rem; margin-bottom: 1rem; }
.add-form input { flex: 1; padding: .5rem; border: 1px solid #ccc; border-radius: 6px; }
.add-form select, .add-form button { padding: .5rem .75rem; border-radius: 6px; border: 1px solid #ccc; cursor: pointer; }
.add-form button { background: #0ea5e9; color: #fff; border: none; font-weight: 700; }
.filter-bar { margin-bottom: 1rem; }
.task-list { display: flex; flex-direction: column; gap: .75rem; }
.task-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 1rem; display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; box-shadow: 0 1px 4px rgba(0,0,0,.05); }
.task-card.high { border-left: 4px solid #ef4444; }
.task-card.medium { border-left: 4px solid #f59e0b; }
.task-card.low { border-left: 4px solid #10b981; }
.priority-badge { font-size: .72rem; font-weight: 700; padding: .1rem .4rem; border-radius: 4px; background: #f1f5f9; text-transform: uppercase; }
.task-info h3 { margin: .25rem 0; font-size: 1rem; }
.task-info p { font-size: .85rem; color: #64748b; margin: 0; }
.task-actions { display: flex; flex-direction: column; gap: .35rem; flex-shrink: 0; }
.task-actions select { padding: .3rem .5rem; border-radius: 6px; border: 1px solid #ccc; font-size: .82rem; }
.del-btn { background: #fee2e2; color: #b91c1c; border: none; border-radius: 6px; padding: .3rem .6rem; cursor: pointer; font-size: .82rem; font-weight: 700; }
.loading, .empty { text-align: center; color: #64748b; padding: 2rem; }
</style>
