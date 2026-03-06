<template>
  <view class="container">
    <view class="page-header">
      <text class="page-title">{{ classInfo.name }}</text>
      <text class="page-subtitle">{{ classInfo.studentCount }}名学员 · 创建于 {{ classInfo.createdAt }}</text>
    </view>

    <view class="stats-cards">
      <view class="stat-card">
        <text class="stat-number">{{ classInfo.studentCount }}</text>
        <text class="stat-label">学员人数</text>
      </view>
      <view class="stat-card">
        <text class="stat-number">{{ classInfo.avgScore }}</text>
        <text class="stat-label">平均评分</text>
      </view>
      <view class="stat-card">
        <text class="stat-number">{{ classInfo.trainingCount }}</text>
        <text class="stat-label">训练次数</text>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">班级学员</text>
        <button class="btn-small" @click="inviteStudent">+ 邀请</button>
      </view>
      <view class="student-list">
        <view v-for="student in students" :key="student.id" class="student-card" @click="goStudentDetail(student.id)">
          <image v-if="student.avatar" class="student-avatar" :src="student.avatar" mode="aspectFill"></image>
          <view v-else class="student-avatar-placeholder">
            <text class="avatar-text">{{ student.nickname?.[0] || student.username?.[0] || '学' }}</text>
          </view>
          <view class="student-info">
            <text class="student-name">{{ student.nickname || student.username }}</text>
            <text class="student-desc">最近训练: {{ student.lastTraining }} · 评分 {{ student.score }}分</text>
          </view>
          <view class="student-trend">
            <text class="trend-text" :class="student.trend > 0 ? 'up' : 'down'">
              {{ student.trend > 0 ? '↑' : '↓' }} {{ Math.abs(student.trend) }}%
            </text>
          </view>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-header">
        <text class="section-title">班级训练记录</text>
      </view>
      <view class="training-list">
        <view v-for="record in trainingRecords" :key="record.id" class="training-card">
          <view class="training-info">
            <text class="training-title">{{ record.title }}</text>
            <text class="training-desc">{{ record.date }} · {{ record.participants }}人参与</text>
          </view>
          <view class="training-stats">
            <text class="training-score">均分 {{ record.avgScore }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const classInfo = ref({
  name: '初级网球班 A',
  studentCount: 12,
  createdAt: '2024-01-15',
  avgScore: 84,
  trainingCount: 28
})

const students = ref([
  { id: 1, nickname: '小明', username: 'xiaoming', avatar: '', lastTraining: '今天 19:30', score: 86, trend: 5 },
  { id: 2, nickname: '小红', username: 'xiaohong', avatar: '', lastTraining: '昨天 18:00', score: 92, trend: 8 },
  { id: 3, nickname: '张三', username: 'zhangsan', avatar: '', lastTraining: '前天 20:00', score: 78, trend: -2 },
  { id: 4, nickname: '李四', username: 'lisi', avatar: '', lastTraining: '3天前', score: 85, trend: 3 },
  { id: 5, nickname: '王五', username: 'wangwu', avatar: '', lastTraining: '4天前', score: 81, trend: -1 }
])

const trainingRecords = ref([
  { id: 1, title: '正手击球训练', date: '2024-03-04', participants: 10, avgScore: 85 },
  { id: 2, title: '发球专项训练', date: '2024-03-02', participants: 8, avgScore: 82 },
  { id: 3, title: '步伐与重心', date: '2024-02-28', participants: 12, avgScore: 88 },
  { id: 4, title: '反手击球训练', date: '2024-02-26', participants: 9, avgScore: 80 }
])

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const classId = currentPage.$page?.options?.id || currentPage.options?.id
  
  if (classId) {
    fetchClassDetail(classId)
  }
})

const fetchClassDetail = async (classId) => {
  // 实际应从云端获取班级详情
  console.log('获取班级详情:', classId)
}

const inviteStudent = () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const classId = currentPage.$page?.options?.id || currentPage.options?.id
  uni.navigateTo({ url: `/pages/coach/student/invite/index?classId=${classId}` })
}

const goStudentDetail = (studentId) => {
  uni.navigateTo({ url: `/pages/coach/student/detail/index?id=${studentId}` })
}
</script>

<style>
.container {
  padding: 20px;
  background: linear-gradient(180deg, #fdf7f2 0%, #f6f2ee 40%, #f6f2ee 100%);
  min-height: 100vh;
}

.page-header {
  margin-bottom: 18px;
  padding: 14px 16px;
  border-radius: 16px;
  background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%);
  color: #fff;
  box-shadow: 0 8px 16px rgba(197, 106, 27, 0.2);
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  display: block;
}

.page-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  margin-top: 4px;
  display: block;
}

.stats-cards {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.stat-card {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #c56a1b;
  display: block;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  display: block;
}

.section {
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.btn-small {
  background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%);
  color: #fff;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 12px;
  border: none;
  line-height: 1.4;
}

.student-list, .training-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.student-card {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.student-card:last-child {
  border-bottom: none;
}

.student-avatar, .student-avatar-placeholder {
  width: 44px;
  height: 44px;
  border-radius: 22px;
  margin-right: 12px;
  background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
}

.student-info {
  flex: 1;
}

.student-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  display: block;
}

.student-desc {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
  display: block;
}

.student-trend {
  text-align: right;
}

.trend-text {
  font-size: 12px;
  font-weight: bold;
}

.trend-text.up {
  color: #4CAF50;
}

.trend-text.down {
  color: #f44336;
}

.training-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.training-card:last-child {
  border-bottom: none;
}

.training-title {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  display: block;
}

.training-desc {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
  display: block;
}

.training-score {
  font-size: 14px;
  font-weight: bold;
  color: #c56a1b;
}
</style>
