'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const { TYPE } = require('../constant/examRecord');
  const Schema = mongoose.Schema;

  const ExamRecordSchema = new Schema({
    // 记录类型
    type: { type: String, required: true, enum: Object.values(TYPE) },

    title: { type: String },
    description: { type: String },
    cover: { type: String },
    content: { type: Object },

    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

  });

  return mongoose.model('ExamRecord', ExamRecordSchema);
};
