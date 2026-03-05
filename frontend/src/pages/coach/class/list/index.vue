<template>
  <view class="container">
    <view class="page-header">
      <text class="page-title">我的班级</text>
      <text class="page-subtitle">管理所有班级和学员</text>
    </view>

    <view class="action-bar">
      <button class="btn-primary" @click="createClass">+ 创建班级</button>
    </view>

    <view class="class-list">
      <view v-if="classes.length === 0" class="empty-state">
        <text class="empty-text">暂无班级，点击下方按钮创建</text>
      </view>
      <view v-for="cls in classes" :key="cls.id" class="class-card">
        <view class="class-header" @click="toggleExpand(cls.id)">
          <view class="class-info">
            <text class="class-name">{{ cls.name }}</text>
            <text class="class-meta">{{ cls.studentCount }}名学员 · 创建于 {{ cls.createdAt }}</text>
          </view>
          <view class="class-actions">
            <text class="expand-icon">{{ expandedClass === cls.id ? '▼' : '▶' }}</text>
          </view>
        </view>
        
        <view v-if="expandedClass === cls.id" class="class-detail">
          <view class="detail-section">
            <text class="detail-title">班级学员</text>
            <view class="student-tags">
              <view v-for="student in cls.students" :key="student.id" class="student-tag" @click="goStudentDetail(student.id)">
                <text class="tag-text">{{ student.nickname || student.username }}</text>
              </view>
              <view v-if="cls.students.length === 0" class="no-student">
                <text class="no-student-text">暂无学员</text>
              </view>
            </view>
          </view>
          
          <view class="detail-actions">
            <button class="btn-outline" @click="inviteToClass(cls.id)">邀请学员</button>
            <button class="btn-primary" @click="goClassDetail(cls.id)">查看详情</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const classes = ref([])
const expandedClass = ref(null)

onMounted(() => {
  fetchClasses()
})

const fetchClasses = async () => {
  // 模拟数据，实际应从云端获取
  classes.value = [
    {
      id: 1,
      name: '初级网球班 A',
      studentCount: 12,
      createdAt: '2024-01-15',
      students: [
        { id: 1, nickname: '小明', username: 'xiaoming' },
        { id: 2, nickname: '小红', username: 'xiaohong' },
        { id: 3, nickname: '张三', username: 'zhangsan' }
      ]
    },
    {
      id: 2,
      name: '青少年提高班',
      studentCount: 8,
      createdAt: '2024-02-01',
      students: [
        { id: 4, nickname: '李四', username: 'lisi' },
        { id: 5, nickname: '王五', username: 'wangwu' }
      ]
    },
    {
      id: 3,
      name: '成人进阶班',
      studentCount: 15,
      createdAt: '2024-02-20',
      students: [
        { id: 6, nickname: '赵六', username: 'zhaoliu' },
        { id: 7, nickname: '孙七', username: 'sunqi' }
      ]
    }
  ]
}

const toggleExpand = (classId) => {
  expandedClass.value = expandedClass.value === classId ? null : classId
}

const createClass = () => {
  uni.navigateTo({ url: '/pages/coach/class/create/index' })
}

const inviteToClass = (classId) => {
  uni.navigateTo({ url: `/pages/coach/student/invite/index?classId=${classId}` })
}

const goClassDetail = (classId) => {
  uni.navigateTo({ url: `/pages/coach/class/detail/index?id=${classId}` })
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

.action-bar {
  margin-bottom: 16px;
}

.btn-primary {
  background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%);
  color: #fff;
  font-size: 14px;
  padding: 12px 24px;
  border-radius: 24px;
  border: none;
  line-height: 1.4;
}

.btn-outline {
  background: transparent;
  border: 1px solid #c56a1b;
  color: #c56a1b;
  font-size: 12px;
  padding: 8px 16px;
  border-radius: 16px;
  line-height: 1.4;
}

.class-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.class-card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.class-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}

.class-info {
  flex: 1;
}

.class-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  display: block;
}

.class-meta {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  display: block;
}

.class-actions {
  display: flex;
  align-items: center;
}

.expand-icon {
  font-size: 14px;
  color: #999;
  margin-left: 8px;
}

.class-detail {
  padding: 0 16px 16px;
  border-top: 1px solid #f0f0f0;
}

.detail-section {
  padding: 12px 0;
}

.detail-title {
  font-size: 13px;
  font-weight: bold;
  color: #666;
  margin-bottom: 8px;
  display: block;
}

.student-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.student-tag {
  background: #f5f5f5;
  padding: 6px 12px;
  border-radius: 16px;
}

.tag-text {
  font-size: 12px;
  color: #333;
}

.no-student {
  padding: 8px 0;
}

.no-student-text {
  font-size: 12px;
  color: #999;
}

.detail-actions {
  display: flex;
  gap: 12px;
  padding-top: 12px;
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
