<template>
  <view class="container">
    <view class="page-header">
      <text class="page-title">注册</text>
      <text class="page-subtitle">创建账号开始记录训练</text>
    </view>

    <view class="card">
      <view class="form-item">
        <text class="label">用户名</text>
        <input class="input" v-model="username" placeholder="请输入用户名" />
      </view>
      <view class="form-item">
        <text class="label">手机号</text>
        <input class="input" v-model="phone" placeholder="可选" />
      </view>
      <view class="form-item">
        <text class="label">密码</text>
        <input class="input" v-model="password" password placeholder="至少 6 位" />
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

const username = ref('')
const phone = ref('')
const password = ref('')
const loading = ref(false)

const handleRegister = async () => {
  if (!username.value || !password.value) {
    uni.showToast({ title: '请输入用户名和密码', icon: 'none' })
    return
  }
  loading.value = true
  try {
    const res = await uni.request({
      url: 'http://localhost:3001/api/auth/register',
      method: 'POST',
      data: {
        username: username.value,
        phone: phone.value,
        password: password.value
      }
    })
    if (res.statusCode === 200 && res.data) {
      uni.showToast({ title: '注册成功', icon: 'none' })
      setTimeout(() => {
        uni.redirectTo({ url: '/pages/auth/login' })
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
  uni.redirectTo({ url: '/pages/auth/login' })
}
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
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.form-item {
  margin-bottom: 14px;
}

.label {
  font-size: 12px;
  color: #666;
  display: block;
  margin-bottom: 6px;
}

.input {
  height: 40px;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 0 12px;
  background-color: #fff;
}

.btn-primary {
  background-color: #c56a1b;
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  width: 100%;
  margin-top: 6px;
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
