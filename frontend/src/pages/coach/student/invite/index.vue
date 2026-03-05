<template>
  <view class="container">
    <view class="page-header">
      <text class="page-title">邀请学员</text>
      <text class="page-subtitle">将学员加入班级</text>
    </view>

    <view class="card">
      <view class="form-item">
        <text class="label">选择班级</text>
        <picker mode="selector" :range="classNames" :value="selectedClassIndex" @change="onClassChange">
          <view class="picker">
            <text class="picker-text">{{ selectedClassName || '请选择班级' }}</text>
            <text class="picker-arrow">></text>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">学员用户名 <text class="required">*</text></text>
        <input class="input" v-model="username" placeholder="请输入学员的用户名" />
      </view>

      <view class="form-item">
        <text class="label">邀请留言</text>
        <textarea class="textarea" v-model="message" placeholder="可选：给学员的留言" />
      </view>

      <button class="btn-primary" :disabled="loading" @click="handleInvite">
        {{ loading ? '邀请中...' : '发送邀请' }}
      </button>
    </view>

    <view class="tips">
      <text class="tips-title">提示：</text>
      <text class="tips-text">1. 学员需要先注册账号才能被邀请</text>
      <text class="tips-text">2. 邀请后学员需要在个人主页确认加入</text>
      <text class="tips-text">3. 一个学员可以同时加入多个班级</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const classes = ref([
  { id: 1, name: '初级网球班 A' },
  { id: 2, name: '青少年提高班' },
  { id: 3, name: '成人进阶班' }
])

const classNames = computed(() => classes.value.map(c => c.name))
const selectedClassIndex = ref(0)
const selectedClassName = computed(() => classes.value[selectedClassIndex.value]?.name)

const username = ref('')
const message = ref('')
const loading = ref(false)

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const classId = currentPage.$page?.options?.classId || currentPage.options?.classId
  
  if (classId) {
    const index = classes.value.findIndex(c => c.id == classId)
    if (index !== -1) {
      selectedClassIndex.value = index
    }
  }
})

const onClassChange = (e) => {
  selectedClassIndex.value = e.detail.value
}

const handleInvite = async () => {
  if (!username.value.trim()) {
    uni.showToast({ title: '请输入学员用户名', icon: 'none' })
    return
  }

  loading.value = true
  try {
    // 实际应调用云端函数发送邀请
    // const res = await uniCloud.callFunction({
    //   name: 'tennis-coach',
    //   data: {
    //     action: 'inviteStudent',
    //     data: {
    //       classId: classes.value[selectedClassIndex.value].id,
    //       username: username.value,
    //       message: message.value
    //     }
    //   }
    // })

    // 模拟邀请成功
    setTimeout(() => {
      uni.showToast({ title: '邀请已发送', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 500)
    }, 500)
  } catch (e) {
    uni.showToast({ title: '邀请失败', icon: 'none' })
  } finally {
    loading.value = false
  }
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
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.form-item {
  margin-bottom: 20px;
}

.label {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  display: block;
}

.required {
  color: #f44336;
}

.input, .textarea, .picker {
  background: #f8f8f8;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  color: #333;
}

.textarea {
  height: 80px;
  width: 100%;
  box-sizing: border-box;
}

.picker {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.picker-text {
  color: #333;
}

.picker-arrow {
  color: #999;
}

.btn-primary {
  background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%);
  color: #fff;
  font-size: 16px;
  padding: 14px 32px;
  border-radius: 24px;
  border: none;
  line-height: 1.4;
  margin-top: 10px;
}

.btn-primary[disabled] {
  opacity: 0.6;
}

.tips {
  background: #fff9e6;
  border-radius: 12px;
  padding: 16px;
  border-left: 4px solid #c56a1b;
}

.tips-title {
  font-size: 14px;
  font-weight: bold;
  color: #c56a1b;
  display: block;
  margin-bottom: 8px;
}

.tips-text {
  font-size: 12px;
  color: #666;
  display: block;
  margin-bottom: 4px;
  line-height: 1.5;
}
</style>
