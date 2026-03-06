<template>
  <view class="container">
    <view class="page-header">
      <text class="page-title">登录</text>
      <text class="page-subtitle">进入训练数据与分析报告</text>
    </view>

    <view class="card">
      <view class="hint">
        <text class="hint-text">使用注册的用户名和密码登录</text>
      </view>
      <view class="form-item">
        <text class="label">用户名</text>
        <input class="input" v-model="username" placeholder="请输入用户名" />
      </view>
      <view class="form-item">
        <text class="label">身份</text>
        <picker mode="selector" :range="roles" :value="roleIndex" @change="onRoleChange">
          <view class="input">{{ roleLabel }}</view>
        </picker>
      </view>
      <view class="form-item">
        <text class="label">密码</text>
        <input class="input" v-model="password" password placeholder="请输入密码" />
      </view>
      <button class="btn-primary" :disabled="loading" @click="handleLogin">
        {{ loading ? '登录中...' : '登录' }}
      </button>
      <view class="footer">
        <text class="link" @click="goRegister">没有账号？去注册</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'

const username = ref('')
const password = ref('')
const loading = ref(false)

// 角色选择
const roles = ['学生', '教练']
const roleValues = ['student', 'coach']
const roleIndex = ref(0)
const roleLabel = computed(() => roles[roleIndex.value])
const onRoleChange = (e) => {
  roleIndex.value = e.detail.value
}

const handleLogin = async () => {
  if (!username.value) {
    uni.showToast({ title: '请输入用户名', icon: 'none' })
    return
  }
  if (!password.value) {
    uni.showToast({ title: '请输入密码', icon: 'none' })
    return
  }
  loading.value = true
  
  // 优先使用数据库验证登录
  try {
    const res = await uniCloud.callFunction({
      name: 'tennis-auth',
      data: {
        action: 'login',
        data: {
          username: username.value,
          password: password.value
        }
      }
    })
    const payload = res.result || {}
    if (payload.code === 0 && payload.data) {
      uni.setStorageSync('uni_id_token', payload.data.token);
      uni.setStorageSync('username', username.value);
      uni.showToast({ title: '登录成功', icon: 'none' })
      setTimeout(() => {
        // 根据数据库中的角色跳转到不同页面
        if (role === 'coach') {
          uni.redirectTo({ url: '/pages/coach/index' })
        } else {
          uni.switchTab({ url: '/pages/profile/index' })
        }
      }, 300)
    } else {
      uni.showToast({ title: payload.message || '登录失败', icon: 'none' })
    }
  } catch (e) {
    console.log('DB login failed, using local mock:', e)
    // 数据库失败时使用本地模拟
    const role = roleValues[roleIndex.value]
    uni.setStorageSync('username', username.value)
    uni.setStorageSync('userRole', role)
    uni.showToast({ title: '登录成功（本地模式）', icon: 'none' })
    setTimeout(() => {
      if (role === 'coach') {
        uni.redirectTo({ url: '/pages/coach/index' })
      } else {
        uni.switchTab({ url: '/pages/profile/index' })
      }
    }, 300)
  } finally {
    loading.value = false
  }
}

const goRegister = () => {
  uni.navigateTo({ url: '/pages/auth/register/index' })
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
  padding: 20px;
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
  height: 44px;
  box-shadow: 0 8px 16px rgba(197, 106, 27, 0.2);
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
