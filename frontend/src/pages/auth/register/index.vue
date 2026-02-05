<template>
  <view class="container">
    <view class="page-header">
      <text class="page-title">注册</text>
      <text class="page-subtitle">创建账号开始记录训练</text>
    </view>

    <view class="card">
      <view class="hint">
        <text class="hint-text">昵称与头像可选，后续可在“我的”修改</text>
      </view>
      <view class="form-item">
        <text class="label">openid</text>
        <input class="input" v-model="openid" placeholder="请输入微信 openid" />
      </view>
      <view class="form-item">
        <text class="label">昵称</text>
        <input class="input" v-model="nickname" placeholder="可选" />
      </view>
      <view class="form-item">
        <text class="label">头像 URL</text>
        <input class="input" v-model="avatar" placeholder="可选" />
      </view>
      <button class="btn-primary" :disabled="loading" @click="handleRegister">
        {{ loading ? '注册中...' : '注册' }}
      </button>
      <view class="footer">
        <text class="link" @click="goLogin">已有账号？去登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const openid = ref('')
const nickname = ref('')
const avatar = ref('')
const loading = ref(false)

const handleRegister = async () => {
  if (!openid.value) {
    uni.showToast({ title: '请输入 openid', icon: 'none' })
    return
  }
  loading.value = true
  try {
    const res = await uni.request({
      url: 'http://localhost:3001/api/auth/register',
      method: 'POST',
      data: {
        openid: openid.value,
        nickname: nickname.value,
        avatar: avatar.value
      }
    })
    if (res.statusCode === 200 && res.data) {
      uni.showToast({ title: '注册成功', icon: 'none' })
      setTimeout(() => {
        uni.redirectTo({ url: '/pages/auth/login/index' })
      }, 300)
    } else {
      uni.showToast({ title: res.data?.message || '注册失败', icon: 'none' })
    }
  } catch (e) {
    uni.showToast({ title: '注册失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const goLogin = () => {
  uni.redirectTo({ url: '/pages/auth/login/index' })
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
  color: rgba(255, 255, 255, 0.8);
  margin-top: 4px;
  display: block;
}

.card {
  background-color: #fff;
  border-radius: 14px;
  padding: 18px;
  border: 1px solid #f3e7dd;
  box-shadow: 0 10px 18px rgba(0,0,0,0.05);
}

.hint {
  background: linear-gradient(135deg, #fff7ef 0%, #f9efe6 100%);
  border: 1px solid #f2d7bf;
  border-radius: 12px;
  padding: 10px 12px;
  margin-bottom: 14px;
}

.hint-text {
  font-size: 12px;
  color: #8b6a4b;
}

.form-item {
  margin-bottom: 14px;
}

.label {
  font-size: 12px;
  color: #8b6a4b;
  display: block;
  margin-bottom: 6px;
}

.input {
  height: 42px;
  border: 1px solid #f0e7de;
  border-radius: 10px;
  padding: 0 12px;
  background-color: #fff;
}

.btn-primary {
  background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%);
  color: #fff;
  border-radius: 22px;
  font-size: 14px;
  width: 100%;
  margin-top: 8px;
}

.footer {
  margin-top: 12px;
  text-align: center;
}

.link {
  color: #c56a1b;
  font-size: 12px;
}
</style>
