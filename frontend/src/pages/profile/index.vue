<template>
  <view class="container">
    <!-- 根据角色显示不同内容 -->
    <template v-if="user && user.role === 'coach'">
      <!-- 教练视图 -->
      <view class="page-header">
        <text class="page-title">教练中心</text>
        <text class="page-subtitle">学员管理与数据看板</text>
      </view>
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
          <button class="btn-outline" @click="logout">退出登录</button>
        </view>
      </view>

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
    </template>

    <template v-else>
      <!-- 学员/访客视图 -->
      <view class="page-header">
        <text class="page-title">我的</text>
        <text class="page-subtitle">训练档案与设备管理</text>
      </view>
      <view class="card profile-card">
        <view class="profile-left" @click="openEditSheet">
          <image v-if="user?.avatar" class="avatar" :src="user.avatar" mode="aspectFill"></image>
          <view v-else class="avatar"></view>
          <view>
            <text class="profile-name">{{ displayName }}</text>
            <text class="profile-desc">{{ displayDesc }}</text>
            <text v-if="user" class="profile-tip">点击头像区域编辑资料</text>
          </view>
        </view>
        <view class="profile-actions">
          <button v-if="!user" class="btn-outline" @click="goLogin">登录</button>
          <button v-if="!user" class="btn-primary" @click="goRegister">注册</button>
          <button v-if="user" class="btn-outline" @click="logout">退出登录</button>
        </view>
      </view>

      <view v-if="showNicknameModal" class="modal-mask">
        <view class="modal-card">
          <text class="modal-title">修改昵称</text>
          <input class="modal-input" v-model="nicknameDraft" placeholder="请输入昵称" />
          <view class="modal-actions">
            <button class="btn-outline" @click="closeNicknameModal">取消</button>
            <button class="btn-primary" @click="confirmNickname" :disabled="saving">{{ saving ? '保存中...' : '确定' }}</button>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-title">设备绑定</view>
        <view class="card">
          <view class="device-row" v-for="item in devices" :key="item.name">
            <view>
              <text class="device-name">{{ item.name }}</text>
              <text class="device-desc">{{ item.desc }}</text>
            </view>
            <text class="device-status" :class="item.status === '已连接' ? 'online' : 'offline'">{{ item.status }}</text>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-title">训练目标</view>
        <view class="card">
          <view class="goal-row" v-for="goal in goals" :key="goal.title">
            <view>
              <text class="goal-title">{{ goal.title }}</text>
              <text class="goal-desc">{{ goal.desc }}</text>
            </view>
            <text class="goal-progress">{{ goal.progress }}</text>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-title">最近训练</view>
        <view class="card">
          <view class="session-row" v-for="session in sessions" :key="session.time">
            <view>
              <text class="session-title">{{ session.title }}</text>
              <text class="session-desc">{{ session.time }}</text>
            </view>
            <text class="session-score">{{ session.score }}</text>
          </view>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue';
import { onShow } from '@dcloudio/uni-app';

// --- 通用状态 ---
const user = ref(null);
const profile = ref(null);

// --- 学员/访客状态 ---
const roleMap = { coach: '教练', student: '学生', guest: '普通用户' };
const devices = ref([{ name: '拍柄设备', desc: 'SN: RH-202402-01', status: '已连接' }, { name: '足底设备', desc: 'SN: FT-202402-02', status: '已连接' }]);
const goals = ref([{ title: '挥拍速度', desc: '目标 130 km/h', progress: '本周 122 km/h' }, { title: '步频节奏', desc: '目标 180 步/分钟', progress: '本周 165 步/分钟' }, { title: 'ACE 球数量', desc: '目标 15 次', progress: '本周 9 次' }]);
const sessions = ref([{ title: '正手击球训练', time: '今天 19:30 · 45 分钟', score: '评分 86' }, { title: '发球专项训练', time: '昨日 18:10 · 30 分钟', score: '评分 79' }, { title: '步伐与重心', time: '02/03 20:00 · 40 分钟', score: '评分 82' }]);
const editNickname = ref('');
const editAvatar = ref('');
const uploading = ref(false);
const saving = ref(false);
const showNicknameModal = ref(false);
const nicknameDraft = ref('');

// --- 教练状态 ---
const coach = ref({ name: '', qualify: '', avatar: '' });
const students = ref([]);
const dashboardData = ref({ avgSpeed: 0, followUpStudents: [] });
const studentUsername = ref('');
const showBindModal = ref(false);
const binding = ref(false);

// --- 计算属性 ---
const displayName = computed(() => {
  if (!user.value) return '未登录';
  return user.value.nickname || user.value.username;
});

const displayDesc = computed(() => {
  if (!user.value) return '登录后同步训练档案';
  const level = profile.value?.level || '初级球员';
  const handedness = profile.value?.handedness || '右手持拍';
  const roleLabel = roleMap[user.value.role] || '普通用户';
  return `${roleLabel} · ${level} · ${handedness}`;
});

// --- 数据获取 ---
const fetchCoachSubData = async () => {
  if (!user.value) return;
  await fetchCoachData();
  const student_ids = await fetchStudentsData();
  if (student_ids && student_ids.length > 0) {
    await fetchDashboardData(student_ids);
  }
};

const fetchCoachData = async () => {
  if (!user.value) return;
  const db = uniCloud.database();
  const { result } = await db.collection('t_coach').where(`user_id == "${user.value._id}"`).get();
  if (result.data && result.data.length > 0) {
    const coachData = result.data[0];
    coach.value.name = coachData.coach_name;
    coach.value.qualify = coachData.coach_qualify;
    coach.value.avatar = user.value.avatar;
  }
};

const fetchDashboardData = async (student_ids) => {
  if (student_ids.length === 0) return;
  const db = uniCloud.database();
  const { result } = await db.collection('tennis-device-data').where({ user_id: db.command.in(student_ids) }).field({ 'racket': 1, 'user_id': 1 }).get();
  if (result.data && result.data.length > 0) {
    const allSpeeds = result.data.map(item => item.racket.speed);
    const totalSpeed = allSpeeds.reduce((sum, speed) => sum + speed, 0);
    dashboardData.value.avgSpeed = Math.round(totalSpeed / allSpeeds.length);
    const followUpStudentIds = result.data.filter(item => item.racket.speed < 100).map(item => item.user_id);
    if (followUpStudentIds.length > 0) {
      dashboardData.value.followUpStudents = students.value.filter(student => followUpStudentIds.includes(student.id)).map(student => student.name);
    }
  }
};

const fetchStudentsData = async () => {
  if (!user.value) return;
  try {
    const res = await uniCloud.callFunction({
      name: 'tennis-coach',
      data: {
        action: 'getStudents',
        data: { coachUsername: user.value.username }
      }
    });
    if (res.result.code === 0) {
      students.value = res.result.data;
      return res.result.data.map(s => s.id);
    } else {
      uni.showToast({ title: res.result.message || '获取学员列表失败', icon: 'none' });
      students.value = [];
      return [];
    }
  } catch (e) {
    uni.showToast({ title: '网络错误，获取学员列表失败', icon: 'none' });
    students.value = [];
    return [];
  }
};

const fetchProfile = async () => {
  const username = uni.getStorageSync('username');
  if (!username) {
    user.value = null;
    profile.value = null;
    return;
  }
  try {
    const res = await uniCloud.callFunction({ name: 'tennis-auth', data: { action: 'me', data: { username } } });
    const payload = res.result || {};
    if (payload.code === 0 && payload.data) {
      user.value = payload.data.user;
      profile.value = payload.data.profile;
      editNickname.value = user.value.nickname || '';
      editAvatar.value = user.value.avatar || '';
      if (user.value.role === 'coach') {
        fetchCoachSubData();
      }
    } else {
      user.value = null;
      profile.value = null;
    }
  } catch (e) {
    user.value = null;
    profile.value = null;
  }
};

// --- 交互方法 ---
const goLogin = () => uni.navigateTo({ url: '/pages/auth/login/index' });
const goRegister = () => uni.navigateTo({ url: '/pages/auth/register/index' });

const logout = () => {
  uni.removeStorageSync('uni_id_token');
  uni.removeStorageSync('username');
  user.value = null;
  profile.value = null;
  uni.showToast({ title: '已退出', icon: 'none' });
};

const openEditSheet = () => {
  if (!user.value) return;
  uni.showActionSheet({ itemList: ['修改头像', '修改昵称'], success: (res) => {
    if (res.tapIndex === 0) chooseAvatar();
    if (res.tapIndex === 1) openNicknameModal();
  }});
};

const openNicknameModal = () => {
  nicknameDraft.value = editNickname.value || '';
  showNicknameModal.value = true;
};

const closeNicknameModal = () => {
  showNicknameModal.value = false;
};

const chooseAvatar = async () => {
  try {
    const [err, res] = await uni.chooseImage({ count: 1, sizeType: ['compressed'] });
    if (err) return;
    const filePath = res.tempFilePaths[0];
    uploading.value = true;
    const upload = await uniCloud.uploadFile({ cloudPath: `avatars/${Date.now()}-${filePath.split('/').pop()}`, filePath });
    editAvatar.value = upload.fileID;
    await saveProfile();
  } catch (e) {
    uni.showToast({ title: '头像上传失败', icon: 'none' });
  } finally {
    uploading.value = false;
  }
};

const saveProfile = async () => {
  if (!user.value) return;
  saving.value = true;
  try {
    const res = await uniCloud.callFunction({ name: 'tennis-auth', data: { action: 'updateProfile', data: { username: user.value.username, nickname: editNickname.value, avatar: editAvatar.value } } });
    const payload = res.result || {};
    if (payload.code === 0 && payload.data) {
      user.value = payload.data.user;
      profile.value = payload.data.profile;
      uni.showToast({ title: '保存成功', icon: 'none' });
      showNicknameModal.value = false;
    } else {
      uni.showToast({ title: payload.message || '保存失败', icon: 'none' });
    }
  } catch (e) {
    uni.showToast({ title: '保存失败', icon: 'none' });
  } finally {
    saving.value = false;
  }
};

const confirmNickname = async () => {
  editNickname.value = nicknameDraft.value;
  await saveProfile();
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
      fetchCoachSubData();
    } else {
      uni.showToast({ title: res.result.message || '绑定失败', icon: 'none' });
    }
  } catch (e) {
    uni.showToast({ title: '绑定失败，请重试', icon: 'none' });
  } finally {
    binding.value = false;
  }
};

const editProfile = () => uni.navigateTo({ url: '/pages/profile/coach-edit' });
const goToStudentDetail = (studentId) => uni.showToast({ title: `跳转到学员 ${studentId} 的详情页（待实现）`, icon: 'none' });

onShow(() => {
  fetchProfile();
});
</script>

<style>
/* --- General Styles --- */
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
  padding: 16px;
  border: 1px solid #f3e7dd;
  box-shadow: 0 8px 16px rgba(0,0,0,0.04);
  margin-bottom: 12px;
}
.profile-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #fff7ef 0%, #f9efe6 100%);
}
.profile-left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background-color: #fff2e6;
  border: 2px solid #f0d7c1;
}
.profile-name {
  font-size: 16px;
  font-weight: bold;
  color: #3d2a1a;
  display: block;
}
.profile-desc {
  font-size: 12px;
  color: #8b6a4b;
  margin-top: 4px;
  display: block;
}
.profile-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}
.btn-outline {
  background-color: #fff;
  color: #c56a1b;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid #c56a1b;
  padding: 0 14px;
  line-height: 2.3;
  height: auto;
}
.btn-primary {
  background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%);
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  margin-left: 8px;
  padding: 0 14px;
}
.section {
  margin-top: 18px;
}
.section-title {
  font-size: 17px;
  font-weight: bold;
  margin-bottom: 12px;
  color: #3d2a1a;
}
.modal-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.modal-card {
  width: 82%;
  background: #fff;
  border-radius: 16px;
  padding: 18px;
  border: 1px solid #f3e7dd;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08);
}
.modal-title {
  font-size: 16px;
  font-weight: bold;
  color: #3d2a1a;
  display: block;
  margin-bottom: 10px;
}
.modal-input {
  height: 42px;
  border: 1px solid #f0e7de;
  border-radius: 10px;
  padding: 0 12px;
  background-color: #fff;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
}
.modal-actions .btn-outline {
  border: 1px solid #c56a1b;
}
.modal-actions .btn-primary {
  margin-left: 0;
}

/* --- Student/Guest Specific --- */
.profile-tip {
  font-size: 11px;
  color: #b48a64;
  margin-top: 2px;
  display: block;
}
.device-row, .goal-row, .session-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0e7de;
}
.device-row:last-child, .goal-row:last-child, .session-row:last-child {
  border-bottom: none;
}
.device-name, .goal-title, .session-title {
  font-size: 14px;
  font-weight: bold;
  color: #3d2a1a;
  display: block;
}
.device-desc, .goal-desc, .session-desc {
  font-size: 12px;
  color: #8b6a4b;
  margin-top: 2px;
  display: block;
}
.device-status { font-size: 12px; font-weight: bold; }
.online { color: #2ecc71; }
.offline { color: #ff4d4f; }
.goal-progress, .session-score { font-size: 12px; font-weight: bold; color: #c56a1b; }

/* --- Coach Specific --- */
.dashboard-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0e7de;
}
.dashboard-item:last-child { border-bottom: none; }
.dashboard-label { font-size: 14px; color: #3d2a1a; }
.dashboard-value { font-size: 14px; color: #8b6a4b; float: right; }
.student-list-header {
  display: flex;
  justify-content: space-between;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid #f0e7de;
  font-size: 12px;
  color: #8b6a4b;
}
.student-list .student-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f0e7de;
}
.student-list .student-item:last-child { border-bottom: none; }
.student-name { font-size: 14px; font-weight: bold; color: #3d2a1a; }
.student-status {
  display: flex;
  align-items: center;
  gap: 8px;
}
.student-desc { font-size: 12px; color: #8b6a4b; }
.arrow { font-size: 16px; color: #c56a1b; }
.empty-state { text-align: center; color: #999; padding: 20px 0; }
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.btn-primary-small {
  background: linear-gradient(135deg, #c56a1b 0%, #d7822d 100%);
  color: #fff;
  border-radius: 20px;
  font-size: 12px;
  padding: 0 12px;
  line-height: 2.3;
}
</style>
