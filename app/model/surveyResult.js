'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const User = require('./user');
  const Schema = mongoose.Schema;

  const SurveyResultSchema = new Schema({

    result: { type: Schema.Types.Object, required: true },
    // 报告状态
    isCompleted: { type: Boolean, default: false },
    // 报告关联用户
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    // 报告关联检查记录
    summary: {  type: Schema.Types.Object },
    survey: { type: Schema.Types.ObjectId, ref: 'Survey', autopopulate: true },

    // 记录是否被删除
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    // 记录创建时间
    createdAt: { type: Date, default: Date.now },
    // 记录更新时间
    updatedAt: { type: Date, default: Date.now },

  });

  SurveyResultSchema.index();
  SurveyResultSchema.plugin(require('mongoose-autopopulate'));
  return mongoose.model('SurveyResult', SurveyResultSchema);
};
