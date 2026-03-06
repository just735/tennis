'use strict';

const db = uniCloud.database();
const users = db.collection("tennis-users");

exports.main = async (event, context) => {
  const { action, data } = event || {};

  if (action === "bindStudent") {
    const { coachUsername, studentUsername } = data || {};

    if (!coachUsername) {
      return { code: 401, message: "教练信息不存在，请重新登录" };
    }
    if (!studentUsername) {
      return { code: 1, message: "请输入学员用户名" };
    }

    const coachRes = await users.where({ username: coachUsername }).get();
    if (!coachRes.data || coachRes.data.length === 0) {
      return { code: 1, message: "未找到该教练账户" };
    }
    const coachId = coachRes.data[0]._id;

    const studentRes = await users.where({ username: studentUsername }).get();
    if (!studentRes.data || studentRes.data.length === 0) {
      return { code: 1, message: "未找到该学员账户" };
    }
    const studentId = studentRes.data[0]._id;

    if (coachId === studentId) {
      return { code: 1, message: "不能绑定自己为学员" };
    }

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

  if (action === "getStudents") {
    const { coachUsername } = data || {};
    if (!coachUsername) {
      return { code: 401, message: "教练信息不存在" };
    }

    const coachRes = await users.where({ username: coachUsername }).get();
    if (!coachRes.data || coachRes.data.length === 0) {
      return { code: 1, message: "未找到该教练账户" };
    }
    const coachId = coachRes.data[0]._id;

    const student_id_res = await db.collection('t_coach_student').where({ coach_id: coachId }).get();
    const student_ids = student_id_res.data.map(item => item.student_id);

    if (student_ids.length === 0) {
      return { code: 0, data: [] };
    }

    const users_res = await db.collection('tennis-users').where({ _id: db.command.in(student_ids) }).get();
    let students_with_names = users_res.data.map(u => ({ id: u._id, name: u.nickname || u.username, training_summary: '暂无训练数据' }));

    const training_promises = students_with_names.map(async (student) => {
      const training_res = await db.collection('training_sessions').where({ user_id: student.id }).orderBy('created_at', 'desc').limit(1).get();
      if (training_res.data.length > 0) {
        student.training_summary = `最近得分: ${training_res.data[0].score}`;
      }
      return student;
    });

    const final_students = await Promise.all(training_promises);

    return { code: 0, data: final_students };
  }

  if (action === "getCoachProfile") {
    const { username } = data || {};
    if (!username) return { code: 401, message: "用户信息不存在" };

    const userRes = await users.where({ username }).get();
    if (!userRes.data || userRes.data.length === 0) return { code: 1, message: "未找到该用户" };
    const userId = userRes.data[0]._id;

    const coachRes = await db.collection('t_coach').where({ user_id: userId }).get();
    if (coachRes.data.length === 0) {
      // 如果没有记录，可以考虑创建一个
      const addRes = await db.collection('t_coach').add({ user_id: userId, coach_name: '', coach_qualify: '' });
      return { code: 0, data: { _id: addRes.id, user_id: userId, coach_name: '', coach_qualify: '' } };
    }
    return { code: 0, data: coachRes.data[0] };
  }

  if (action === "updateCoachProfile") {
    const { username, coach_name, coach_qualify } = data || {};
    if (!username) return { code: 401, message: "用户信息不存在" };

    const userRes = await users.where({ username }).get();
    if (!userRes.data || userRes.data.length === 0) return { code: 1, message: "未找到该用户" };
    const userId = userRes.data[0]._id;

    await db.collection('t_coach').where({ user_id: userId }).update({
      coach_name,
      coach_qualify
    });
    return { code: 0, message: "更新成功" };
  }

  return { code: 1, message: "未知 action" };
};