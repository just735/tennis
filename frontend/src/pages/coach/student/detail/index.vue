<template>
  <view class="container">
    <view class="page-header">
      <text class="page-title">{{ studentInfo.nickname || studentInfo.username }}</text>
      <text class="page-subtitle">{{ studentInfo.className }} · 学员详情</text>
    </view>

    <!-- 学员基本信息 -->
    <view class="card profile-card">
      <view class="profile-left">
        <image v-if="studentInfo.avatar" class="avatar" :src="studentInfo.avatar" mode="aspectFill"></image>
        <view v-else class="avatar-placeholder">
          <text class="avatar-text">{{ studentInfo.nickname?.[0] || studentInfo.username?.[0] || '学' }}</text>
        </view>
        <view>
          <text class="profile-name">{{ studentInfo.nickname || studentInfo.username }}</text>
          <text class="profile-desc">{{ studentInfo.level }} · {{ studentInfo.handedness }}</text>
        </view>
      </view>
      <view class="profile-stats">
        <text class="stats-score">{{ studentInfo.avgScore }}</text>
        <text class="stats-label">平均分</text>
      </view>
    </view>

    <!-- 训练数据概览 -->
    <view class="stats-cards">
      <view class="stat-card">
        <text class="stat-number">{{ studentInfo.totalTrainings }}</text>
        <text class="stat-label">总训练次数</text>
      </view>
      <view class="stat-card">
        <text class="stat-number">{{ studentInfo.totalTime }}</text>
        <text class="stat-label">总时长(小时)</text>
      </view>
      <view class="stat-card">
        <text class="stat-number">{{ studentInfo.streak }}</text>
        <text class="stat-label">连续训练(天)</text>
      </view>
    </view>

    <!-- 技能雷达图 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">技能分析</text>
      </view>
      <view class="card">
        <view class="skill-list">
          <view v-for="skill in skills" :key="skill.name" class="skill-item">
            <view class="skill-header">
              <text class="skill-name">{{ skill.name }}</text>
              <text class="skill-score">{{ skill.score }}分</text>
            </view>
            <view class="skill-bar">
              <view class="skill-progress" :style="{ width: skill.score + '%' }"></view>
            </view>
            <text class="skill-desc">{{ skill.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 训练记录 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">最近训练</text>
        <text class="view-all" @click="viewAllTrainings">查看全部 ></text>
      </view>
      <view class="training-list">
        <view v-for="training in recentTrainings" :key="training.id" class="training-card">
          <view class="training-info">
            <text class="training-title">{{ training.title }}</text>
            <text class="training-desc">{{ training.date }} · {{ training.duration }}分钟</text>
          </view>
          <view class="training-stats">
            <text class="training-score">{{ training.score }}分</text>
            <text class="trend-text" :class="training.trend > 0 ? 'up' : 'down'">
              {{ training.trend > 0 ? '↑' : '↓' }} {{ Math.abs(training.trend) }}%
            </text>
          </view>
        </view>
      </view>
    </view>

    <!-- 教练备注 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">教练备注</text>
        <text class="edit-btn" @click="editNote">编辑</text>
      </view>
      <view class="card">
        <text class="note-text">{{ studentInfo.note || '暂无备注' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const studentInfo = ref({
  id: 1,
  nickname: '小明',
  username: 'xiaoming',
  avatar: '',
  className: '初级网球班 A',
  level: '初级球员',
  handedness: '右手持拍',
  avgScore: 86,
  totalTrainings: 28,
  totalTime: 42,
  streak: 5,
  note: '进步明显，正手击球稳定性有待提高，建议加强步伐训练。'
})

const skills = ref([
  { name: '正手击球', score: 82, desc: '稳定性良好，力量适中' },
  { name: '反手击球', score: 78, desc: '需要加强练习' },
  { name: '发球', score: 88, desc: '动作标准，落点准确' },
  { name: '步伐移动', score: 75, desc: '反应速度需提升' },
  { name: '网前截击', score: 85, desc: '手感不错' }
])

const recentTrainings = ref([
  { id: 1, title: '正手击球训练', date: '2024-03-04', duration: 45, score: 88, trend: 5 },
  { id: 2, title: '发球专项训练', date: '2024-03-02', duration: 30, score: 85, trend: 2 },
  { id: 3, title: '步伐与重心', date: '2024-02-28', duration: 40, score: 82, trend: -3 },
  { id: 4, title: '反手击球训练', date: '2024-02-26', duration: 35, score: 80, trend: 4 }
])

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const studentId = currentPage.$page?.options?.id || currentPage.options?.id
  
  if (studentId) {
    fetchStudentDetail(studentId)
  }
})

const fetchStudentDetail = async (studentId) => {
  // 实际应从云端获取学员详情
  console.log('获取学员详情:', studentId)
}

const viewAllTrainings = () => {
  const studentId = studentInfo.value.id
  uni.navigateTo({ url: `/pages/coach/student/trainings/index?id=${studentId}` })
}

const editNote = () => {
  uni.showModal({
    title: '编辑备注',
    editable: true,
    content: studentInfo.value.note || '',
    success: (res) => {
      if (res.confirm) {
        studentInfo.value.note = res.content
        // 实际应保存到云端
        uni.showToast({ title: '备注已更新', icon: 'success' })
      }
    }
  })
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

.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.profile-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-left {
  display: flex;
  align-items: center;
}

.avatar, .avatar-placeholder {
  width: 60px;
  height: 60px;
  border-radius: 30px;
  margin-right: 12px;
  background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}

.profile-name {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  display: block;
}

.profile-desc {
  font-size: 13px;
  color: #666;
  margin-top: 4px;
  display: block;
}

.profile-stats {
  text-align: center;
}

.stats-score {
  font-size: 28px;
  font-weight: bold;
  color: #c56a1b;
  display: block;
}

.stats-label {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
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
  font-size: 22px;
  font-weight: bold;
  color: #c56a1b;
  display: block;
}

.stat-label {
  font-size: 11px;
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

.view-all, .edit-btn {
  font-size: 12px;
  color: #c56a1b;
}

.skill-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.skill-item {
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.skill-item:last-child {
  padding-bottom: 0;
  border-bottom: none;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.skill-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.skill-score {
  font-size: 14px;
  font-weight: bold;
  color: #c56a1b;
}

.skill-bar {
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 6px;
}

.skill-progress {
  height: 100%;
  background: linear-gradient(90deg, #c56a1b 0%, #d7822d 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.skill-desc {
  font-size: 11px;
  color: #999;
}

.training-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
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

.training-stats {
  text-align: right;
}

.training-score {
  font-size: 14px;
  font-weight: bold;
  color: #c56a1b;
  display: block;
}

.trend-text {
  font-size: 11px;
  margin-top: 2px;
  display: block;
}

.trend-text.up {
  color: #4CAF50;
}

.trend-text.down {
  color: #f44336;
}

.note-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}
</style>
