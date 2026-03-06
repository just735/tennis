<template>
  <view class="container">
    <view class="page-header">
      <text class="page-title">学员管理</text>
      <text class="page-subtitle">查看所有学员的训练数据</text>
    </view>

    <!-- 搜索栏 -->
    <view class="search-bar">
      <input class="search-input" v-model="searchKeyword" placeholder="搜索学员姓名" @confirm="searchStudents" />
      <button class="search-btn" @click="searchStudents">搜索</button>
    </view>

    <!-- 筛选标签 -->
    <view class="filter-tags">
      <view class="filter-tag" :class="{ active: currentFilter === 'all' }" @click="setFilter('all')">
        <text class="tag-text">全部</text>
      </view>
      <view class="filter-tag" :class="{ active: currentFilter === 'active' }" @click="setFilter('active')">
        <text class="tag-text">活跃</text>
      </view>
      <view class="filter-tag" :class="{ active: currentFilter === 'inactive' }" @click="setFilter('inactive')">
        <text class="tag-text">需关注</text>
      </view>
    </view>

    <view class="student-list">
      <view v-if="filteredStudents.length === 0" class="empty-state">
        <text class="empty-text">暂无学员数据</text>
      </view>
      <view v-for="student in filteredStudents" :key="student.id" class="student-card" @click="goStudentDetail(student.id)">
        <view class="student-header">
          <image v-if="student.avatar" class="student-avatar" :src="student.avatar" mode="aspectFill"></image>
          <view v-else class="student-avatar-placeholder">
            <text class="avatar-text">{{ student.nickname?.[0] || student.username?.[0] || '学' }}</text>
          </view>
          <view class="student-basic">
            <text class="student-name">{{ student.nickname || student.username }}</text>
            <text class="student-class">{{ student.className }}</text>
          </view>
          <view class="student-status" :class="student.status">
            <text class="status-text">{{ statusMap[student.status] }}</text>
          </view>
        </view>
        
        <view class="student-stats">
          <view class="stat-item">
            <text class="stat-value">{{ student.totalTrainings }}</text>
            <text class="stat-label">训练次数</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ student.avgScore }}</text>
            <text class="stat-label">平均评分</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ student.lastTraining }}</text>
            <text class="stat-label">最近训练</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const searchKeyword = ref('')
const currentFilter = ref('all')

const statusMap = {
  active: '活跃',
  inactive: '需关注',
  normal: '正常'
}

const students = ref([
  {
    id: 1,
    nickname: '小明',
    username: 'xiaoming',
    avatar: '',
    className: '初级网球班 A',
    status: 'active',
    totalTrainings: 28,
    avgScore: 86,
    lastTraining: '今天'
  },
  {
    id: 2,
    nickname: '小红',
    username: 'xiaohong',
    avatar: '',
    className: '青少年提高班',
    status: 'active',
    totalTrainings: 32,
    avgScore: 92,
    lastTraining: '昨天'
  },
  {
    id: 3,
    nickname: '张三',
    username: 'zhangsan',
    avatar: '',
    className: '成人进阶班',
    status: 'normal',
    totalTrainings: 15,
    avgScore: 78,
    lastTraining: '3天前'
  },
  {
    id: 4,
    nickname: '李四',
    username: 'lisi',
    avatar: '',
    className: '初级网球班 A',
    status: 'inactive',
    totalTrainings: 8,
    avgScore: 72,
    lastTraining: '7天前'
  },
  {
    id: 5,
    nickname: '王五',
    username: 'wangwu',
    avatar: '',
    className: '青少年提高班',
    status: 'active',
    totalTrainings: 25,
    avgScore: 88,
    lastTraining: '2天前'
  }
])

const filteredStudents = computed(() => {
  let result = students.value
  
  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(s => 
      (s.nickname && s.nickname.toLowerCase().includes(keyword)) ||
      (s.username && s.username.toLowerCase().includes(keyword))
    )
  }
  
  // 状态筛选
  if (currentFilter.value === 'active') {
    result = result.filter(s => s.status === 'active')
  } else if (currentFilter.value === 'inactive') {
    result = result.filter(s => s.status === 'inactive')
  }
  
  return result
})

onMounted(() => {
  fetchStudents()
})

const fetchStudents = async () => {
  // 实际应从云端获取学员列表
  console.log('获取学员列表')
}

const searchStudents = () => {
  // 搜索逻辑已通过计算属性实现
  console.log('搜索:', searchKeyword.value)
}

const setFilter = (filter) => {
  currentFilter.value = filter
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

.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.search-input {
  flex: 1;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 24px;
  padding: 10px 16px;
  font-size: 14px;
}

.search-btn {
  background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%);
  color: #fff;
  font-size: 14px;
  padding: 10px 20px;
  border-radius: 24px;
  border: none;
  line-height: 1.4;
}

.filter-tags {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.filter-tag {
  background: #fff;
  padding: 8px 16px;
  border-radius: 16px;
  border: 1px solid #e0e0e0;
}

.filter-tag.active {
  background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%);
  border-color: #c56a1b;
}

.filter-tag.active .tag-text {
  color: #fff;
}

.tag-text {
  font-size: 13px;
  color: #666;
}

.student-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.student-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.student-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.student-avatar, .student-avatar-placeholder {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-right: 12px;
  background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-text {
  color: #fff;
  font-size: 18px;
  font-weight: bold;
}

.student-basic {
  flex: 1;
}

.student-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: block;
}

.student-class {
  font-size: 12px;
  color: #999;
  margin-top: 2px;
  display: block;
}

.student-status {
  padding: 4px 10px;
  border-radius: 10px;
}

.student-status.active {
  background: #e8f5e9;
}

.student-status.inactive {
  background: #ffebee;
}

.student-status.normal {
  background: #f5f5f5;
}

.status-text {
  font-size: 11px;
  color: #666;
}

.student-status.active .status-text {
  color: #4CAF50;
}

.student-status.inactive .status-text {
  color: #f44336;
}

.student-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: block;
}

.stat-label {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
  display: block;
}

.empty-state {
  padding: 48px 24px;
  text-align: center;
  background: #fff;
  border-radius: 12px;
}

.empty-text {
  font-size: 14px;
  color: #999;
}
</style>
