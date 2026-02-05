<template>
  <view class="container">
    <view class="page-header">
      <text class="page-title">排名</text>
      <text class="page-subtitle">训练表现榜（后续接入真实排行数据）</text>
    </view>

    <view class="card">
      <view class="summary-row">
        <view class="summary-item">
          <text class="summary-label">我的当前段位</text>
          <text class="summary-value">青铜</text>
        </view>
        <view class="summary-item">
          <text class="summary-label">本周积分</text>
          <text class="summary-value">120</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">排行榜（示例）</view>
      <view class="card">
        <view class="rank-row" v-for="item in mockRank" :key="item.rank">
          <view class="rank-left">
            <text class="rank-num">{{ item.rank }}</text>
            <view class="rank-user">
              <text class="rank-name">{{ item.name }}</text>
              <text class="rank-desc">{{ item.desc }}</text>
            </view>
          </view>
          <text class="rank-score">{{ item.score }}</text>
        </view>
      </view>
    </view>

    <view class="section">
      <view class="section-title">说明</view>
      <view class="card">
        <text class="note">当前展示为静态示例数据，二次迭代接入后端排行接口与筛选条件。</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const mockRank = ref([
  { rank: 1, name: 'Player A', desc: '稳定挥拍，步频节奏优秀', score: 980 },
  { rank: 2, name: 'Player B', desc: '发球 ACE 较多', score: 920 },
  { rank: 3, name: 'Player C', desc: '重心转移更充分', score: 880 },
  { rank: 4, name: 'Player D', desc: '正手击球命中率高', score: 860 },
  { rank: 5, name: 'Player E', desc: '训练频次更高', score: 820 }
])
</script>

<style>
.container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.page-header {
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

.card {
  background-color: #fff;
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.summary-row {
  display: flex;
  gap: 12px;
}

.summary-item {
  flex: 1;
  background-color: #fff7ee;
  border: 1px solid #ffe2c8;
  border-radius: 10px;
  padding: 12px;
}

.summary-label {
  font-size: 12px;
  color: #666;
  display: block;
}

.summary-value {
  margin-top: 6px;
  font-size: 18px;
  font-weight: bold;
  color: #111;
  display: block;
}

.section {
  margin-top: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.rank-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.rank-row:last-child {
  border-bottom: none;
}

.rank-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.rank-num {
  width: 26px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border-radius: 50%;
  background-color: #fff2e6;
  color: #c56a1b;
  font-weight: bold;
  font-size: 12px;
}

.rank-user {
  display: flex;
  flex-direction: column;
}

.rank-name {
  font-size: 14px;
  font-weight: bold;
  color: #222;
}

.rank-desc {
  font-size: 12px;
  color: #888;
  margin-top: 2px;
}

.rank-score {
  font-size: 14px;
  font-weight: bold;
  color: #111;
}

.note {
  font-size: 12px;
  color: #777;
  line-height: 1.6;
}
</style>
