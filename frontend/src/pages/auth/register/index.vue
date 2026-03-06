<template>
  <view class="container">
    <view class="page-header">
      <text class="page-title">注册</text>
    </view>
    <view class="card">
      <view class="hint">
        <text class="hint-text">欢迎加入智网训练，开启您的网球新篇章</text>
      </view>
      <view class="form-item">
        <text class="label">用户名</text>
        <input class="input" v-model="username" placeholder="请输入用户名" />
      </view>
      <view class="form-item">
        <text class="label">密码</text>
        <input class="input" v-model="password" type="password" placeholder="请输入密码" />
      </view>
      <view class="form-item">
        <text class="label">确认密码</text>
        <input class="input" v-model="passwordConfirm" type="password" placeholder="请再次输入密码" />
      </view>
      <view class="form-item">
        <text class="label">身份</text>
        <picker mode="selector" :range="roles" :value="roleIndex" @change="onRoleChange">
          <view class="input">{{ roleLabel }}</view>
        </picker>
      </view>
      <button class="btn-primary" @click="handleRegister" :disabled="loading">{{ loading ? '注册中...' : '注册' }}</button>
      <view class="footer-link">
        <text>已有账号？</text>
        <text class="link" @click="goLogin">立即登录</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';

const username = ref('');
const password = ref('');
const passwordConfirm = ref('');
const roleIndex = ref(0);
const roles = ['学员', '教练'];
const roleValues = ['student', 'coach'];
const loading = ref(false);

const roleLabel = computed(() => roles[roleIndex.value]);

const onRoleChange = (e) => {
  roleIndex.value = e.detail.value;
};

const handleRegister = async () => {
  if (!username.value || !password.value || !passwordConfirm.value) {
    uni.showToast({ title: '请填写完整的注册信息', icon: 'none' });
    return;
  }
  if (password.value !== passwordConfirm.value) {
    uni.showToast({ title: '两次输入的密码不一致', icon: 'none' });
    return;
  }
  loading.value = true;
  try {
    const res = await uniCloud.callFunction({
      name: 'tennis-auth',
      data: {
        action: 'register',
        data: {
          username: username.value,
          password: password.value,
          passwordConfirm: passwordConfirm.value,
          role: roleValues[roleIndex.value]
        }
      }
    });
    const payload = res.result || {};
    if (payload.code === 0) {
      uni.showToast({ title: '注册成功', icon: 'none' });
      setTimeout(() => {
        uni.navigateTo({ url: '/pages/auth/login/index' });
      }, 300);
    } else {
      uni.showToast({ title: payload.message || '注册失败', icon: 'none' });
    }
  } catch (e) {
    uni.showToast({ title: '注册失败，请稍后重试', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

const goLogin = () => {
  uni.navigateTo({ url: '/pages/auth/login/index' });
};
</script>

<style>
.container { padding: 20px; background: linear-gradient(180deg, #fdf7f2 0%, #f6f2ee 100%); min-height: 100vh; }
.page-header { margin-bottom: 18px; }
.page-title { font-size: 24px; font-weight: bold; color: #3d2a1a; }
.card { background-color: #fff; border-radius: 14px; padding: 20px; border: 1px solid #f3e7dd; box-shadow: 0 8px 16px rgba(0,0,0,0.04); }
.hint { text-align: center; margin-bottom: 20px; }
.hint-text { font-size: 14px; color: #8b6a4b; }
.form-item { margin-bottom: 15px; }
.label { font-size: 14px; color: #3d2a1a; margin-bottom: 8px; display: block; }
.input { height: 44px; border: 1px solid #f0e7de; border-radius: 10px; padding: 0 12px; background-color: #fff; font-size: 14px; }
.btn-primary { background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%); color: #fff; border-radius: 20px; font-size: 16px; margin-top: 20px; }
.footer-link { text-align: center; margin-top: 20px; font-size: 14px; color: #8b6a4b; }
.link { color: #c56a1b; margin-left: 5px; }
</style>
