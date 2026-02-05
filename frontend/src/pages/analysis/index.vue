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
    const res = await uni.request({
      url: 'http://localhost:3001/api/analysis/suggestion',
      method: 'GET'
    })
    if (res.statusCode === 200 && res.data) {
      videoUrl.value = res.data.videoUrl
    }
  } catch (e) {
    console.error('Failed to fetch static suggestions', e)
  }
}

const refreshPreview = async () => {
  await fetchStaticData()
  uni.showToast({ title: '已刷新', icon: 'none' })
}

const generateReport = async () => {
  loading.value = true
  try {
    const res = await uni.request({
      url: 'http://localhost:3001/api/analysis/report',
      method: 'POST',
      data: {
        // 实际场景中这里会发送最近的运动数据
        userId: 'test-user'
      }
    })
    
    if (res.statusCode === 200 && res.data) {
      report.value = res.data.report
      comparison.value = res.data.comparison
      suggestions.value = res.data.suggestions
    }
  } catch (e) {
    console.error('Analysis failed', e)
    uni.showToast({ title: '分析失败，请检查后端', icon: 'none' })
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
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-title {
  font-size: 20px;
  font-weight: bold;
  color: #222;
  display: block;
}

.page-subtitle {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
  display: block;
}

.actions-inline {
  display: flex;
  align-items: center;
  gap: 8px;
}

.section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.card {
  background-color: #fff;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.btn-outline {
  background-color: #fff;
  color: #c56a1b;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid #c56a1b;
}

.btn-primary {
  background-color: #c56a1b;
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
}

.tips {
  background-color: #fff7e6;
  border: 1px solid #ffe7ba;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 12px;
}

.tip {
  font-size: 12px;
  color: #ad6800;
}

.report-content {
  margin-top: 15px;
  padding: 10px;
  background-color: #f0f7ff;
  border-radius: 8px;
}

.report-text {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
}

.chart-grid {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.chart-placeholder {
  background-color: #f9f9f9;
  border: 1px dashed #ccc;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  font-size: 12px;
}

.chart-placeholder.small {
  flex: 1;
  height: 100px;
}

.comparison {
  margin-top: 15px;
  border-top: 1px solid #eee;
  padding-top: 10px;
}

.sub-title {
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 5px;
  display: block;
}

.desc {
  font-size: 13px;
  color: #666;
}

.video-placeholder {
  height: 180px;
  background-color: #000;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  margin-bottom: 15px;
}

.video-player {
  width: 100%;
  height: 180px;
  border-radius: 8px;
  margin-bottom: 15px;
}

.training-category {
  margin-bottom: 10px;
}

.category-name {
  font-size: 13px;
  color: #999;
  margin-bottom: 5px;
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
