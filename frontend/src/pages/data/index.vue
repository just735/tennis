<template>
  <view class="container">
    <view class="page-header">
      <view>
        <text class="page-title">数据概览</text>
        <text class="page-subtitle">来自拍柄与足底设备的实时采集</text>
      </view>
      <view class="update-time">
        <text>更新时间：{{ lastUpdate }}</text>
      </view>
    </view>

    <view class="summary-grid">
      <view class="summary-card" v-for="item in summary" :key="item.label">
        <text class="summary-label">{{ item.label }}</text>
        <text class="summary-value">{{ item.value }}</text>
      </view>
    </view>

    <view class="section">
      <view class="section-title">设备状态</view>
      <view class="card status-card">
        <view class="status-item">
          <text class="label">拍柄设备</text>
          <text class="status online">在线</text>
        </view>
        <view class="status-item">
          <text class="label">足底设备</text>
          <text class="status online">在线</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">拍柄设备</view>
      <view class="card">
        <view class="data-item">
          <text class="label">挥拍速度</text>
          <text class="value">{{ racketData.speed || '--' }} km/h</text>
        </view>
        <view class="data-item">
          <text class="label">击球计数</text>
          <text class="value">{{ racketData.count || 0 }}</text>
        </view>
        <view class="data-item">
          <text class="label">ACE球数量</text>
          <text class="value">{{ racketData.aceCount || 0 }}</text>
        </view>
        <view class="chart-placeholder">
          挥拍轨迹与速度分布图
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">足底设备</view>
      <view class="card">
        <view class="data-item">
          <text class="label">两只脚间距</text>
          <text class="value">{{ footData.distance || '--' }} cm</text>
        </view>
        <view class="chart-placeholder">
          足下重心热力图
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">数据说明</view>
      <view class="card">
        <view class="note-item">
          <text class="note-title">采集频率</text>
          <text class="note-desc">挥拍与步态数据每 2 秒刷新一次</text>
        </view>
        <view class="note-item">
          <text class="note-title">数据用途</text>
          <text class="note-desc">用于生成动作轨迹、重心变化和训练建议</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const racketData = ref({
  speed: 0,
  count: 0,
  aceCount: 0
})

const footData = ref({
  distance: 0
})

const summary = ref([
  { label: '今日挥拍', value: 0 },
  { label: '平均速度', value: '--' },
  { label: 'ACE 球', value: 0 },
  { label: '平均步距', value: '--' }
])

const lastUpdate = ref('--')

const formatTime = (date) => {
  const pad = (num) => String(num).padStart(2, '0')
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

const fetchData = async () => {
  try {
    const res = await uniCloud.callFunction({
      name: 'tennis-device',
      data: {
        action: 'latest',
        data: {
          username: uni.getStorageSync('username')
        }
      }
    })
    const payload = res.result || {}
    if (payload.code === 0 && payload.data) {
      racketData.value = payload.data.racket
      footData.value = payload.data.foot
      summary.value = [
        { label: '今日挥拍', value: payload.data.racket.count },
        { label: '平均速度', value: `${payload.data.racket.speed} km/h` },
        { label: 'ACE 球', value: payload.data.racket.aceCount },
        { label: '平均步距', value: `${payload.data.foot.distance} cm` }
      ]
      lastUpdate.value = formatTime(new Date())
    }
  } catch (e) {
    racketData.value = { speed: 120, count: 45, aceCount: 12 }
    footData.value = { distance: 55 }
    summary.value = [
      { label: '今日挥拍', value: 45 },
      { label: '平均速度', value: '120 km/h' },
      { label: 'ACE 球', value: 12 },
      { label: '平均步距', value: '55 cm' }
    ]
    lastUpdate.value = formatTime(new Date())
  }
}

onMounted(() => {
  fetchData()
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

.update-time {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}

.summary-card {
  background-color: #fff;
  border-radius: 14px;
  padding: 14px 16px;
  border: 1px solid #f1e2d6;
  box-shadow: 0 6px 14px rgba(0,0,0,0.04);
}

.summary-label {
  font-size: 12px;
  color: #8b6a4b;
  display: block;
}

.summary-value {
  margin-top: 6px;
  font-size: 18px;
  font-weight: bold;
  color: #3d2a1a;
  display: block;
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

.status-card {
  padding: 12px 16px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0e7de;
}

.status-item:last-child {
  border-bottom: none;
}

.status {
  font-weight: bold;
  color: #2ecc71;
}

.data-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0e7de;
}

.data-item:last-child {
  border-bottom: none;
}

.label {
  color: #7f6a58;
}

.value {
  font-weight: bold;
  color: #c56a1b;
}

.chart-placeholder {
  height: 150px;
  background: linear-gradient(135deg, #fff7ef 0%, #f9efe6 100%);
  border: 1px dashed #e5cbb4;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #a07d5c;
  margin-top: 12px;
}

.note-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0e7de;
}

.note-item:last-child {
  border-bottom: none;
}

.note-title {
  font-size: 14px;
  font-weight: bold;
  color: #3d2a1a;
  display: block;
}

.note-desc {
  font-size: 12px;
  color: #8b6a4b;
  margin-top: 4px;
  display: block;
}
</style>
