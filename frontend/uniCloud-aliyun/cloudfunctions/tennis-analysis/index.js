"use strict";

exports.main = async (event) => {
  const { action } = event || {};
  if (!action || action === "suggestion") {
    return {
      code: 0,
      data: {
        videoUrl: "https://example.com/standard-tennis-serve.mp4",
        drills: [
          { category: "上肢", title: "哑铃手腕弯举", sets: "3组 x 15次" },
          { category: "躯干", title: "药球转体", sets: "3组 x 20次" },
          { category: "下肢", title: "绳梯步伐训练", sets: "5分钟" }
        ]
      }
    };
  }
  if (action === "report") {
    return {
      code: 0,
      data: {
        report:
          "【AI 分析报告】\n通过分析您的挥拍轨迹，我们发现您的击球点略微偏后。建议提前引拍，并在击球瞬间保持手腕锁定。\n\n重心变化方面，您的重心转移在正手击球时不够充分，导致发力受限。",
        comparison: "与费德勒相比，您的正手引拍幅度较小，击球瞬间的拍面关闭程度较低。",
        suggestions: {
          upper: ["增强手腕力量训练", "练习提前引拍动作"],
          core: ["加强转腰练习", "核心爆发力训练"],
          lower: ["进行并步移动训练", "深蹲增强腿部力量"]
        }
      }
    };
  }
  return { code: 1, message: "未知 action" };
};
