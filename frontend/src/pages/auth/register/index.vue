<template>
  <view class="container">
    <view class="page-header">
      <text class="page-title">注册</text>
      <text class="page-subtitle">创建账号开始记录训练</text>
    </view>

    <view class="card">
      <view class="hint">
        <text class="hint-text">注册后可在个人主页完善资料</text>
      </view>
      <view class="form-item">
        <text class="label">用户名</text>
        <input class="input" v-model="username" placeholder="请输入用户名" />
      </view>
      <view class="form-item">
        <text class="label">身份</text>
        <picker mode="selector" :range="roles" @change="onRoleChange">
          <view class="input">{{ roleLabel }}</view>
        </picker>
        <text class="role-tip">选择适合你的身份，可在个人主页完善资料</text>
      </view>
      <view class="form-item">
        <text class="label">密码</text>
        <input class="input" v-model="password" password placeholder="请输入密码" />
      </view>
      <view class="form-item">
        <text class="label">确认密码</text>
        <input class="input" v-model="passwordConfirm" password placeholder="请再次输入密码" />
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
import { ref, computed } from 'vue'

const username = ref('')
const roles = ['教练', '学生', '普通用户']
const role = ref('普通用户')
const roleLabel = computed(() => role.value)
const onRoleChange = (e) => {
  role.value = roles[e.detail.value]
}
const password = ref('')
const passwordConfirm = ref('')
const loading = ref(false)

const handleRegister = async () => {
  if (!username.value) {
    uni.showToast({ title: '请输入用户名', icon: 'none' })
    return
  }
  if (!password.value || !passwordConfirm.value) {
    uni.showToast({ title: '请输入并确认密码', icon: 'none' })
    return
  }
  if (password.value !== passwordConfirm.value) {
    uni.showToast({ title: '两次密码不一致', icon: 'none' })
    return
  }
  loading.value = true
  try {
    const res = await uniCloud.callFunction({
      name: 'tennis-auth',
      data: {
        action: 'register',
        data: {
          username: username.value,
          role: role.value === '教练' ? 'coach' : role.value === '学生' ? 'student' : 'guest',
          password: password.value,
          passwordConfirm: passwordConfirm.value
        }
      }
    })
    const payload = res.result || {}
    if (payload.code === 0) {
      uni.showToast({ title: '注册成功', icon: 'none' })
      setTimeout(() => {
        uni.redirectTo({ url: '/pages/auth/login/index' })
      }, 300)
    } else {
      uni.showToast({ title: payload.message || '注册失败', icon: 'none' })
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

.role-tip {
  font-size: 11px;
  color: #b48a64;
  margin-top: 6px;
  display: block;
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
