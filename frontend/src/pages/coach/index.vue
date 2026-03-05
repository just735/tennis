<template>
  <view class="container">
    <view class="page-header">
      <text class="page-title">教练工作台</text>
      <text class="page-subtitle">班级管理与学员训练数据</text>
    </view>

    <!-- 教练信息卡片 -->
    <view class="card profile-card">
      <view class="profile-left">
        <image v-if="user?.avatar" class="avatar" :src="user.avatar" mode="aspectFill"></image>
        <view v-else class="avatar-placeholder">
          <text class="avatar-text">{{ user?.nickname?.[0] || user?.username?.[0] || '教' }}</text>
        </view>
        <view>
          <text class="profile-name">{{ user?.nickname || user?.username || '教练' }}</text>
          <text class="profile-desc">{{ classCount }}个班级 · {{ studentCount }}名学员</text>
        </view>
      </view>
      <view class="profile-actions">
        <button class="btn-outline" @click="logout">退出</button>
      </view>
    </view>

    <!-- 快捷操作 -->
    <view class="section">
      <view class="section-title">快捷操作</view>
      <view class="quick-actions">
        <view class="action-item" @click="createClass">
          <view class="action-icon create">
            <text class="icon">+</text>
          </view>
          <text class="action-text">创建班级</text>
        </view>
        <view class="action-item" @click="inviteStudent">
          <view class="action-icon invite">
            <text class="icon">👤</text>
          </view>
          <text class="action-text">邀请学员</text>
        </view>
        <view class="action-item" @click="viewAllData">
          <view class="action-icon data">
            <text class="icon">📊</text>
          </view>
          <text class="action-text">训练数据</text>
        </view>
      </view>
    </view>

    <!-- 我的班级 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">我的班级</text>
        <text class="view-all" @click="viewAllClasses">查看全部 ></text>
      </view>
      <view class="class-list">
        <view v-if="classes.length === 0" class="empty-state">
          <text class="empty-text">暂无班级，点击上方创建班级</text>
        </view>
        <view v-for="cls in classes" :key="cls.id" class="class-card" @click="goClassDetail(cls.id)">
          <view class="class-info">
            <text class="class-name">{{ cls.name }}</text>
            <text class="class-desc">{{ cls.studentCount }}名学员 · {{ cls.createdAt }}</text>
          </view>
          <view class="class-arrow">
            <text class="arrow">></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 最近活跃学员 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">最近活跃学员</text>
        <text class="view-all" @click="viewAllStudents">查看全部 ></text>
      </view>
      <view class="student-list">
        <view v-if="recentStudents.length === 0" class="empty-state">
          <text class="empty-text">暂无学员数据</text>
        </view>
        <view v-for="student in recentStudents" :key="student.id" class="student-card" @click="goStudentDetail(student.id)">
          <image v-if="student.avatar" class="student-avatar" :src="student.avatar" mode="aspectFill"></image>
          <view v-else class="student-avatar-placeholder">
            <text class="avatar-text">{{ student.nickname?.[0] || student.username?.[0] || '学' }}</text>
          </view>
          <view class="student-info">
            <text class="student-name">{{ student.nickname || student.username }}</text>
            <text class="student-desc">{{ student.className }} · 最近训练: {{ student.lastTraining }}</text>
          </view>
          <view class="student-stats">
            <text class="stats-score">{{ student.score }}分</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const user = ref(null)
const classCount = ref(0)
const studentCount = ref(0)

// 模拟班级数据
const classes = ref([
  { id: 1, name: '初级网球班 A', studentCount: 12, createdAt: '2024-01-15' },
  { id: 2, name: '青少年提高班', studentCount: 8, createdAt: '2024-02-01' },
  { id: 3, name: '成人进阶班', studentCount: 15, createdAt: '2024-02-20' }
])

// 模拟最近活跃学员数据
const recentStudents = ref([
  { id: 1, nickname: '小明', username: 'xiaoming', avatar: '', className: '初级网球班 A', lastTraining: '今天 19:30', score: 86 },
  { id: 2, nickname: '小红', username: 'xiaohong', avatar: '', className: '青少年提高班', lastTraining: '昨天 18:00', score: 92 },
  { id: 3, nickname: '张三', username: 'zhangsan', avatar: '', className: '成人进阶班', lastTraining: '前天 20:00', score: 78 },
  { id: 4, nickname: '李四', username: 'lisi', avatar: '', className: '初级网球班 A', lastTraining: '3天前', score: 85 }
])

onMounted(() => {
  fetchCoachInfo()
})

const fetchCoachInfo = async () => {
  const username = uni.getStorageSync('username')
  if (!username) {
    uni.redirectTo({ url: '/pages/auth/login/index' })
    return
  }
  
  try {
    const res = await uniCloud.callFunction({
      name: 'tennis-auth',
      data: {
        action: 'me',
        data: { username }
      }
    })
    const payload = res.result || {}
    if (payload.code === 0 && payload.data) {
      user.value = payload.data.user
      // 检查是否为教练角色
      if (user.value.role !== 'coach') {
        uni.showToast({ title: '请以教练身份登录', icon: 'none' })
        setTimeout(() => {
          uni.redirectTo({ url: '/pages/auth/login/index' })
        }, 1500)
        return
      }
    }
    
    // 更新统计数据
    classCount.value = classes.value.length
    studentCount.value = recentStudents.value.length
  } catch (e) {
    console.error('获取教练信息失败', e)
  }
}

const createClass = () => {
  uni.navigateTo({ url: '/pages/coach/class/create/index' })
}

const inviteStudent = () => {
  uni.navigateTo({ url: '/pages/coach/student/invite/index' })
}

const viewAllData = () => {
  uni.navigateTo({ url: '/pages/coach/data/index' })
}

const viewAllClasses = () => {
  uni.navigateTo({ url: '/pages/coach/class/list/index' })
}

const viewAllStudents = () => {
  uni.navigateTo({ url: '/pages/coach/student/list/index' })
}

const goClassDetail = (classId) => {
  uni.navigateTo({ url: `/pages/coach/class/detail/index?id=${classId}` })
}

const goStudentDetail = (studentId) => {
  uni.navigateTo({ url: `/pages/coach/student/detail/index?id=${studentId}` })
}

const logout = () => {
  uni.removeStorageSync('username')
  uni.showToast({ title: '已退出登录', icon: 'none' })
  setTimeout(() => {
    uni.redirectTo({ url: '/pages/auth/login/index' })
  }, 300)
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
  width: 56px;
  height: 56px;
  border-radius: 28px;
  margin-right: 12px;
  background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  color: #fff;
  font-size: 20px;
  font-weight: bold;
}

.profile-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: block;
}

.profile-desc {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  display: block;
}

.profile-actions {
  display: flex;
  gap: 8px;
}

.btn-outline {
  background: transparent;
  border: 1px solid #c56a1b;
  color: #c56a1b;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 16px;
  line-height: 1.4;
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

.view-all {
  font-size: 12px;
  color: #c56a1b;
}

.quick-actions {
  display: flex;
  justify-content: space-around;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 16px;
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.action-icon.create {
  background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%);
}

.action-icon.invite {
  background: linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%);
}

.action-icon.data {
  background: linear-gradient(135deg, #2196F3 0%, #42A5F5 100%);
}

.icon {
  color: #fff;
  font-size: 20px;
}

.action-text {
  font-size: 12px;
  color: #333;
}

.class-list, .student-list {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.class-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.class-card:last-child {
  border-bottom: none;
}

.class-name {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  display: block;
}

.class-desc {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  display: block;
}

.class-arrow {
  color: #ccc;
}

.arrow {
  font-size: 16px;
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
  width: 40px;
  height: 40px;
  border-radius: 20px;
  margin-right: 12px;
  background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
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

.student-stats {
  text-align: right;
}

.stats-score {
  font-size: 14px;
  font-weight: bold;
  color: #c56a1b;
}

.empty-state {
  padding: 32px;
  text-align: center;
}

.empty-text {
  font-size: 12px;
  color: #999;
}
</style>
