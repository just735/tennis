<template>
  <view class="container">
    <view class="page-header">
      <text class="page-title">创建班级</text>
      <text class="page-subtitle">创建新的训练班级</text>
    </view>

    <view class="card">
      <view class="form-item">
        <text class="label">班级名称 <text class="required">*</text></text>
        <input class="input" v-model="form.name" placeholder="请输入班级名称，如：初级网球班A" />
      </view>

      <view class="form-item">
        <text class="label">班级描述</text>
        <textarea class="textarea" v-model="form.description" placeholder="请输入班级描述，如：面向初学者的基础训练班" />
      </view>

      <view class="form-item">
        <text class="label">训练等级</text>
        <picker mode="selector" :range="levels" @change="onLevelChange">
          <view class="picker">
            <text class="picker-text">{{ form.level || '请选择训练等级' }}</text>
            <text class="picker-arrow">></text>
          </view>
        </picker>
      </view>

      <view class="form-item">
        <text class="label">训练时间</text>
        <input class="input" v-model="form.schedule" placeholder="如：每周二、四 19:00-21:00" />
      </view>

      <view class="form-item">
        <text class="label">训练地点</text>
        <input class="input" v-model="form.location" placeholder="请输入训练地点" />
      </view>

      <view class="form-item">
        <text class="label">最大人数</text>
        <slider class="slider" :min="5" :max="30" :value="form.maxStudents" show-value @change="onMaxStudentsChange" />
      </view>

      <button class="btn-primary" :disabled="loading" @click="handleCreate">
        {{ loading ? '创建中...' : '创建班级' }}
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const levels = ['初级', '中级', '高级', '专业']

const form = ref({
  name: '',
  description: '',
  level: '',
  schedule: '',
  location: '',
  maxStudents: 15
})

const loading = ref(false)

const onLevelChange = (e) => {
  form.value.level = levels[e.detail.value]
}

const onMaxStudentsChange = (e) => {
  form.value.maxStudents = e.detail.value
}

const handleCreate = async () => {
  if (!form.value.name.trim()) {
    uni.showToast({ title: '请输入班级名称', icon: 'none' })
    return
  }

  loading.value = true
  try {
    // 实际应调用云端函数创建班级
    // const res = await uniCloud.callFunction({
    //   name: 'tennis-coach',
    //   data: {
    //     action: 'createClass',
    //     data: form.value
    //   }
    // })

    // 模拟创建成功
    setTimeout(() => {
      uni.showToast({ title: '创建成功', icon: 'success' })
      setTimeout(() => {
        uni.navigateBack()
      }, 500)
    }, 500)
  } catch (e) {
    uni.showToast({ title: '创建失败', icon: 'none' })
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

.slider {
  margin: 10px 0;
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
</style>
