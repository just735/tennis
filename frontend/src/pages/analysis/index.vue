<template>
  <view class="container">
    <view class="page-header">
      <view>
        <text class="page-title">动作分析</text>
        <text class="page-subtitle">结合设备数据与 AI 生成训练建议</text>
      </view>
      <view class="actions-inline">
        <button class="btn-outline" @click="refreshPreview" :disabled="loading">刷新预览</button>
      </view>
    </view>

    <view class="section">
      <view class="section-title">分析数据</view>
      <view class="card">
        <view class="analysis-actions">
          <button class="btn-primary" @click="generateReport" :disabled="loading">
            {{ loading ? 'AI 分析中...' : '生成 AI 分析报告' }}
          </button>
        </view>
        
        <view v-if="report" class="report-content">
          <text class="report-text">{{ report }}</text>
        </view>
        
        <view class="chart-grid">
          <view class="chart-placeholder small">
            挥拍动作轨迹
          </view>
          <view class="chart-placeholder small">
            重心变化 / 步频节奏
          </view>
        </view>
        
        <view class="comparison" v-if="comparison">
          <text class="sub-title">名人对比</text>
          <text class="desc">{{ comparison }}</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">提升建议</view>
      <view class="card">
        <view class="tips">
          <text class="tip">建议先完成一次训练，再生成报告可得到更贴近的结果</text>
        </view>
        <view class="video-placeholder" v-if="!videoUrl">
          <text>标准动作示范视频 (加载中...)</text>
        </view>
        <video v-else :src="videoUrl" class="video-player" controls poster="/static/logo.png"></video>
        
        <view class="training-plan" v-if="suggestions">
          <view class="sub-title">动作训练建议</view>
          <view class="training-category" v-for="(items, category) in suggestions" :key="category">
            <text class="category-name">{{ categoryMap[category] || category }}</text>
            <view class="tags">
              <text class="tag" v-for="item in items" :key="item">{{ item }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(false)
const report = ref('')
const comparison = ref('')
const suggestions = ref(null)
const videoUrl = ref('')

const categoryMap = {
  upper: '上肢',
  core: '躯干',
  lower: '下肢'
}

const fetchStaticData = async () => {
  try {
    const res = await uniCloud.callFunction({
      name: 'tennis-analysis',
      data: {
        action: 'suggestion'
      }
    })
    const payload = res.result || {}
    if (payload.code === 0 && payload.data) {
      videoUrl.value = payload.data.videoUrl
    }
  } catch (e) {
  }
}

const refreshPreview = async () => {
  await fetchStaticData()
  uni.showToast({ title: '已刷新', icon: 'none' })
}

const generateReport = async () => {
  loading.value = true
  try {
    const res = await uniCloud.callFunction({
      name: 'tennis-analysis',
      data: {
        action: 'report',
        data: {
          username: uni.getStorageSync('username')
        }
      }
    })
    const payload = res.result || {}
    if (payload.code === 0 && payload.data) {
      report.value = payload.data.report
      comparison.value = payload.data.comparison
      suggestions.value = payload.data.suggestions
    }
  } catch (e) {
    uni.showToast({ title: '分析失败，请检查云函数', icon: 'none' })
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStaticData()
})
</script>

<style>
.container {
  padding: 20px;
  background: linear-gradient(180deg, #fdf7f2 0%, #f6f2ee 40%, #f6f2ee 100%);
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
  display: block;
}

.actions-inline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section {
  margin-bottom: 22px;
}

.section-title {
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #3d2a1a;
}

.card {
  background-color: #fff;
  border-radius: 14px;
  padding: 16px;
  border: 1px solid #f3e7dd;
  box-shadow: 0 8px 16px rgba(0,0,0,0.04);
}

.btn-outline {
  background-color: #fff;
  color: #c56a1b;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.btn-primary {
  background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%);
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
}

.tips {
  background-color: #fff7ef;
  border: 1px solid #f2d7bf;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 14px;
}

.tip {
  font-size: 12px;
  color: #9c6c44;
}

.report-content {
  margin-top: 15px;
  padding: 12px;
  background: linear-gradient(135deg, #fff7ef 0%, #f8efe6 100%);
  border-radius: 10px;
  border: 1px solid #f2d7bf;
}

.report-text {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.chart-grid {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.chart-placeholder {
  background: linear-gradient(135deg, #fff7ef 0%, #f9efe6 100%);
  border: 1px dashed #e5cbb4;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #a07d5c;
  font-size: 12px;
}

.chart-placeholder.small {
  flex: 1;
  height: 100px;
}

.comparison {
  margin-top: 16px;
  border-top: 1px solid #f0e7de;
  padding-top: 12px;
}

.sub-title {
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 6px;
  display: block;
}

.desc {
  font-size: 13px;
  color: #7f6a58;
}

.video-placeholder {
  height: 180px;
  background: linear-gradient(135deg, #3b2b22 0%, #1f1510 100%);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  margin-bottom: 15px;
}

.video-player {
  width: 100%;
  height: 180px;
  border-radius: 12px;
  margin-bottom: 15px;
}

.training-category {
  margin-bottom: 10px;
}

.category-name {
  font-size: 13px;
  color: #8b6a4b;
  margin-bottom: 6px;
  display: block;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  background-color: #fff2e6;
  color: #c56a1b;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
}
</style>
