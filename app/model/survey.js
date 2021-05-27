'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const SurveySchema = new Schema({
    completeCount: { type: Number, default: 0 },
    title: { type: String },
    description: { type: String },
    reference: { type: String },
    cover: { type: String },
    content: { type: Object },
    estTime: { type: Number }, // 预计完成时间，单位秒
    // 是否被锁定
    isBlocked: { type: Boolean, default: false },
    // 是否被删除
    isDeleted: { type: Boolean, default: false },
    // 创建时间
    createdAt: { type: Date, default: Date.now },
    // 更新时间
    updatedAt: { type: Date, default: Date.now },
  });

  const model = mongoose.model('Survey', SurveySchema);

  return model;
};
