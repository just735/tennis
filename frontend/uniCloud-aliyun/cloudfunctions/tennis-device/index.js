"use strict";

const db = uniCloud.database();
const deviceData = db.collection("tennis-device-data");

const mockPayload = () => ({
  racket: {
    speed: Math.floor(Math.random() * (150 - 80) + 80),
    count: Math.floor(Math.random() * 200),
    aceCount: Math.floor(Math.random() * 20)
  },
  foot: {
    distance: Math.floor(Math.random() * (80 - 30) + 30),
    heatmap: "mock_heatmap_data"
  }
});

exports.main = async (event) => {
  const { action, data } = event || {};
  if (action !== "latest") {
    return { code: 1, message: "未知 action" };
  }
  const { username } = data || {};
  if (!username) {
    return { code: 0, data: mockPayload() };
  }
  const record = await deviceData.where({ username }).orderBy("create_time", "desc").limit(1).get();
  if (record.data && record.data.length) {
    const payload = record.data[0];
    return {
      code: 0,
      data: {
        racket: payload.racket || mockPayload().racket,
        foot: payload.foot || mockPayload().foot
      }
    };
  }
  return { code: 0, data: mockPayload() };
};
