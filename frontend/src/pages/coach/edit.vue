<template>
  <view class="container">
    <view class="form-group">
      <text class="label">教练姓名</text>
      <input class="input" v-model="formData.coach_name" placeholder="请输入教练姓名" />
    </view>
    <view class="form-group">
      <text class="label">资质信息</text>
      <textarea class="textarea" v-model="formData.coach_qualify" placeholder="请输入资质信息，例如：PTR 职业级教练员"></textarea>
    </view>
    <button class="btn-save" @click="saveProfile" :disabled="loading">{{ loading ? '保存中...' : '保存' }}</button>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';

const formData = ref({ coach_name: '', coach_qualify: '' });
const loading = ref(false);
const username = uni.getStorageSync('username');

const fetchCoachProfile = async () => {
  if (!username) return;
  loading.value = true;
  try {
    const res = await uniCloud.callFunction({ name: 'tennis-coach', data: { action: 'getCoachProfile', data: { username } } });
    if (res.result.code === 0 && res.result.data) {
      formData.value.coach_name = res.result.data.coach_name || '';
      formData.value.coach_qualify = res.result.data.coach_qualify || '';
    }
  } finally {
    loading.value = false;
  }
};

const saveProfile = async () => {
  if (!username) return;
  loading.value = true;
  try {
    await uniCloud.callFunction({ name: 'tennis-coach', data: { action: 'updateCoachProfile', data: { username, ...formData.value } } });
    uni.showToast({ title: '保存成功', icon: 'success' });
    setTimeout(() => uni.navigateBack(), 1000);
  } catch (e) {
    uni.showToast({ title: '保存失败', icon: 'none' });
  } finally {
    loading.value = false;
  }
};

onLoad(() => {
  fetchCoachProfile();
});
</script>

<style>
.container { padding: 20px; background-color: #f5f5f5; min-height: 100vh; }
.form-group { background-color: #fff; padding: 15px; border-radius: 10px; margin-bottom: 15px; }
.label { font-size: 16px; font-weight: bold; margin-bottom: 10px; display: block; }
.input, .textarea { width: 100%; font-size: 14px; border: none; background-color: #f9f9f9; padding: 10px; border-radius: 5px; box-sizing: border-box; }
.textarea { height: 100px; }
.btn-save { background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%); color: #fff; border-radius: 20px; font-size: 16px; margin-top: 20px; }
</style>
