"use strict";

const crypto = require("crypto");

const db = uniCloud.database();
const users = db.collection("tennis-users");

const hashPassword = (password, salt) =>
  crypto.createHash("sha256").update(`${password}:${salt}`).digest("hex");

const buildProfile = (record) => {
  const ext = record.ext_info || {};
  return {
    level: ext.level || "初级球员",
    handedness: ext.handedness || "右手持拍"
  };
};

const mapUser = (record) => ({
  _id: record._id,
  username: record.username,
  role: record.role || "guest",
  nickname: record.nickname || "",
  avatar: record.avatar || ""
});

exports.main = async (event, context) => {
  const { action, data } = event || {};
  if (!action) {
    return { code: 1, message: "缺少 action" };
  }
  if (action === "register") {
    const { username, password, passwordConfirm, role, nickname, avatar } = data || {};
    if (!username) return { code: 1, message: "请输入用户名" };
    if (!password) return { code: 1, message: "请输入密码" };
    if (password !== passwordConfirm) return { code: 1, message: "两次密码不一致" };
    const existing = await users.where({ username }).limit(1).get();
    if (existing.data && existing.data.length) {
      return { code: 1, message: "用户名已存在" };
    }
    const now = Date.now();
    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = hashPassword(password, salt);
    const extInfo = { level: "初级球员", handedness: "右手持拍" };
    const insert = await users.add({
      username,
      role: role || "guest",
      nickname: nickname || "",
      avatar: avatar || "",
      password_hash: passwordHash,
      password_salt: salt,
      ext_info: extInfo,
      create_time: now,
      update_time: now
    });
    return {
      code: 0,
      data: {
        user: { _id: insert.id, username, role: role || "guest", nickname: nickname || "", avatar: avatar || "" },
        profile: extInfo
      }
    };
  }
  if (action === "login") {
    const { username, password } = data || {};
    if (!username) return { code: 1, message: "请输入用户名" };
    if (!password) return { code: 1, message: "请输入密码" };
    const record = await users.where({ username }).limit(1).get();
    const user = record.data && record.data[0];
    if (!user) return { code: 1, message: "用户不存在" };
    const passwordHash = hashPassword(password, user.password_salt || "");
    if (!user.password_hash || passwordHash !== user.password_hash) {
      return { code: 1, message: "用户名或密码错误" };
    }
    return {
      code: 0,
      data: {
        user: mapUser(user),
        profile: buildProfile(user)
      }
    };
  }
  if (action === "me") {
    const { username } = data || {};
    if (!username) return { code: 1, message: "未登录" };
    const record = await users.where({ username }).limit(1).get();
    const user = record.data && record.data[0];
    if (!user) return { code: 1, message: "用户不存在" };
    return {
      code: 0,
      data: {
        user: mapUser(user),
        profile: buildProfile(user)
      }
    };
  }
  if (action === "updateProfile") {
    const { username, nickname, avatar } = data || {};
    if (!username) return { code: 1, message: "未登录" };
    const updateData = { update_time: Date.now() };
    if (typeof nickname === "string") updateData.nickname = nickname;
    if (typeof avatar === "string") updateData.avatar = avatar;
    await users.where({ username }).update(updateData);
    const record = await users.where({ username }).limit(1).get();
    const user = record.data && record.data[0];
    if (!user) return { code: 1, message: "用户不存在" };
    return {
      code: 0,
      data: {
        user: mapUser(user),
        profile: buildProfile(user)
      }
    };
  }
  if (action === "bindStudent") {
    const { studentUsername } = data || {};
    const { uid } = context;

    if (!uid) {
      return { code: 401, message: "教练未登录" };
    }

    if (!studentUsername) {
      return { code: 1, message: "请输入学员用户名" };
    }

    const studentRes = await users.where({ username: studentUsername }).get();
    if (!studentRes.data || studentRes.data.length === 0) {
      return { code: 1, message: "未找到该学员" };
    }
    const studentId = studentRes.data[0]._id;

    const coachId = uid;

    const relationRes = await db.collection('t_coach_student').where({
      coach_id: coachId,
      student_id: studentId
    }).count();

    if (relationRes.total > 0) {
      return { code: 1, message: "已绑定该学员，请勿重复操作" };
    }

    await db.collection('t_coach_student').add({
      coach_id: coachId,
      student_id: studentId,
    });

    return { code: 0, message: "绑定成功" };
  }
  return { code: 1, message: "未知 action" };
};
