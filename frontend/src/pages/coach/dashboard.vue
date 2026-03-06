<template>
  <view class="container">
    <!-- 顶部个人信息卡片 -->
    <view class="card profile-card">
      <view class="profile-left">
        <image class="avatar" :src="coach.avatar || '/static/logo.png'" mode="aspectFill"></image>
        <view>
          <text class="profile-name">{{ coach.name || '教练姓名' }}</text>
          <text class="profile-desc">{{ coach.qualify || '暂无资质信息' }}</text>
        </view>
      </view>
      <view class="profile-actions">
        <button class="btn-outline" @click="editProfile">编辑资料</button>
      </view>
    </view>

    <!-- 核心教学看板 -->
    <view class="section">
      <view class="section-title">核心教学看板</view>
      <view class="card">
        <view class="dashboard-item">
          <text class="dashboard-label">学员平均拍头速度</text>
          <text class="dashboard-value">{{ dashboardData.avgSpeed }} km/h</text>
        </view>
        <view class="dashboard-item">
          <text class="dashboard-label">重点待跟进学员</text>
          <text class="dashboard-value">{{ dashboardData.followUpStudents.join(', ') || '暂无' }}</text>
        </view>
        <view class="dashboard-item">
          <text class="dashboard-label">训练计划整体完成率</text>
          <text class="dashboard-value">--%</text>
        </view>
      </view>
    </view>

    <!-- 学员管理 -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">学员管理</text>
        <button class="btn-primary-small" @click="openBindModal">绑定学员</button>
      </view>
      <view class="card">
        <view v-if="students.length > 0">
          <view class="student-list-header">
            <text>学员</text>
            <text>近期状态</text>
          </view>
          <view class="student-list">
            <view class="student-item" v-for="student in students" :key="student.id" @click="goToStudentDetail(student.id)">
              <text class="student-name">{{ student.name }}</text>
              <view class="student-status">
                <text class="student-desc">{{ student.training_summary || '暂无' }}</text>
                <text class="arrow">></text>
              </view>
            </view>
          </view>
        </view>
        <view v-else class="empty-state">
          暂无学员信息
        </view>
      </view>
    </view>

    <!-- 绑定学员模态框 -->
    <view v-if="showBindModal" class="modal-mask">
      <view class="modal-card">
        <text class="modal-title">绑定新学员</text>
        <input class="modal-input" v-model="studentUsername" placeholder="请输入学员的用户名" />
        <view class="modal-actions">
          <button class="btn-outline" @click="closeBindModal">取消</button>
          <button class="btn-primary" @click="confirmBinding" :disabled="binding">{{ binding ? '绑定中...' : '确定' }}</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { onShow } from '@dcloudio/uni-app';

const user = ref(null);
const coach = ref({ name: '', qualify: '', avatar: '' });
const students = ref([]);
const dashboardData = ref({ avgSpeed: 0, followUpStudents: [] });
const studentUsername = ref('');
const showBindModal = ref(false);
const binding = ref(false);

const fetchInitialData = async () => {
  const username = uni.getStorageSync('username');
  if (!username) {
    uni.showToast({ title: '请先登录', icon: 'none' });
    uni.reLaunch({ url: '/pages/profile/index' });
    return;
  }
  try {
    const meRes = await uniCloud.callFunction({ name: 'tennis-auth', data: { action: 'me', data: { username } } });
    if (meRes.result.code !== 0) throw new Error('获取用户信息失败');
    user.value = meRes.result.data.user;

    await fetchCoachData();
    const student_ids = await fetchStudentsData();
    if (student_ids && student_ids.length > 0) {
      await fetchDashboardData(student_ids);
    }
  } catch (e) {
    uni.showToast({ title: e.message || '网络错误，请重试', icon: 'none' });
  }
};

const fetchCoachData = async () => {
  if (!user.value) return;
  const res = await uniCloud.callFunction({ name: 'tennis-coach', data: { action: 'getCoachProfile', data: { username: user.value.username } } });
  if (res.result.code === 0 && res.result.data) {
    coach.value.name = res.result.data.coach_name;
    coach.value.qualify = res.result.data.coach_qualify;
    coach.value.avatar = user.value.avatar;
  }
};

const fetchStudentsData = async () => {
  if (!user.value) return [];
  const res = await uniCloud.callFunction({ name: 'tennis-coach', data: { action: 'getStudents', data: { coachUsername: user.value.username } } });
  if (res.result.code === 0) {
    students.value = res.result.data;
    return res.result.data.map(s => s.id);
  } else {
    students.value = [];
    return [];
  }
};

const fetchDashboardData = async (student_ids) => {
  if (student_ids.length === 0) return;
  const db = uniCloud.database();
  const { result } = await db.collection('tennis-device-data').where({ user_id: db.command.in(student_ids) }).field({ 'racket': 1, 'user_id': 1 }).get();
  if (result.data && result.data.length > 0) {
    const allSpeeds = result.data.map(item => item.racket.speed).filter(Boolean);
    if (allSpeeds.length > 0) {
      const totalSpeed = allSpeeds.reduce((sum, speed) => sum + speed, 0);
      dashboardData.value.avgSpeed = Math.round(totalSpeed / allSpeeds.length);
    }
    const followUpStudentIds = result.data.filter(item => item.racket.speed < 100).map(item => item.user_id);
    if (followUpStudentIds.length > 0) {
      dashboardData.value.followUpStudents = students.value.filter(student => followUpStudentIds.includes(student.id)).map(student => student.name);
    }
  }
};

const openBindModal = () => {
  studentUsername.value = '';
  showBindModal.value = true;
};

const closeBindModal = () => {
  showBindModal.value = false;
};

const confirmBinding = async () => {
  if (!studentUsername.value) {
    uni.showToast({ title: '请输入学员用户名', icon: 'none' });
    return;
  }
  binding.value = true;
  try {
    const res = await uniCloud.callFunction({ name: 'tennis-coach', data: { action: 'bindStudent', data: { coachUsername: user.value.username, studentUsername: studentUsername.value } } });
    if (res.result.code === 0) {
      uni.showToast({ title: '绑定成功', icon: 'success' });
      closeBindModal();
      fetchInitialData();
    } else {
      uni.showToast({ title: res.result.message || '绑定失败', icon: 'none' });
    }
  } catch (e) {
    uni.showToast({ title: '绑定失败，请重试', icon: 'none' });
  } finally {
    binding.value = false;
  }
};

const editProfile = () => uni.navigateTo({ url: '/pages/coach/edit' });
const goToStudentDetail = (studentId) => uni.showToast({ title: `跳转到学员 ${studentId} 的详情页（待实现）`, icon: 'none' });

onShow(() => {
  fetchInitialData();
});
</script>

<style>
.container { padding: 20px; background: linear-gradient(180deg, #fdf7f2 0%, #f6f2ee 40%, #f6f2ee 100%); min-height: 100vh; }
.card { background-color: #fff; border-radius: 14px; padding: 16px; margin-bottom: 12px; border: 1px solid #f3e7dd; box-shadow: 0 8px 16px rgba(0,0,0,0.04); }
.profile-card { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, #fff7ef 0%, #f9efe6 100%); }
.profile-left { display: flex; align-items: center; gap: 12px; }
.avatar { width: 52px; height: 52px; border-radius: 50%; background-color: #fff2e6; border: 2px solid #f0d7c1; }
.profile-name { font-size: 16px; font-weight: bold; color: #3d2a1a; display: block; }
.profile-desc { font-size: 12px; color: #8b6a4b; margin-top: 4px; display: block; }
.profile-actions { display: flex; align-items: center; gap: 8px; }
.btn-outline { background-color: #fff; color: #c56a1b; border-radius: 20px; font-size: 14px; border: 1px solid #c56a1b; padding: 0 14px; line-height: 2.3; height: auto; }
.section { margin-top: 18px; }
.section-title { font-size: 17px; font-weight: bold; margin-bottom: 12px; color: #3d2a1a; }
.dashboard-item { padding: 10px 0; border-bottom: 1px solid #f0e7de; }
.dashboard-item:last-child { border-bottom: none; }
.dashboard-label { font-size: 14px; color: #3d2a1a; }
.dashboard-value { font-size: 14px; color: #8b6a4b; float: right; }
.section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.btn-primary-small { background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%); color: #fff; border-radius: 20px; font-size: 12px; padding: 0 12px; line-height: 2.3; }
.student-list-header { display: flex; justify-content: space-between; padding-bottom: 8px; margin-bottom: 8px; border-bottom: 1px solid #f0e7de; font-size: 12px; color: #8b6a4b; }
.student-list .student-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0e7de; }
.student-list .student-item:last-child { border-bottom: none; }
.student-name { font-size: 14px; font-weight: bold; color: #3d2a1a; }
.student-status { display: flex; align-items: center; gap: 8px; }
.student-desc { font-size: 12px; color: #8b6a4b; }
.arrow { font-size: 16px; color: #c56a1b; }
.empty-state { text-align: center; color: #999; padding: 20px 0; }
.modal-mask { position: fixed; left: 0; top: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.35); display: flex; align-items: center; justify-content: center; z-index: 999; }
.modal-card { width: 82%; background: #fff; border-radius: 16px; padding: 18px; border: 1px solid #f3e7dd; box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08); }
.modal-title { font-size: 16px; font-weight: bold; color: #3d2a1a; display: block; margin-bottom: 10px; }
.modal-input { height: 42px; border: 1px solid #f0e7de; border-radius: 10px; padding: 0 12px; background-color: #fff; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px; }
.modal-actions .btn-outline { border: 1px solid #c56a1b; }
.modal-actions .btn-primary { background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%); color: #fff; }
</style>
