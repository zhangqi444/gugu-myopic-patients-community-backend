'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TopicSchema = new Schema({
    // 标签名称
    name: { type: String, required: true, unique: true, index: true },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  });

  // 对标签名进行唯一索引
  TopicSchema.index({ name: 1 }, { unique: true });

  return mongoose.model('Topic', TopicSchema);
};
