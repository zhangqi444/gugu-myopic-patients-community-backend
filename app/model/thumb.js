'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const {ACTION_ACTOR_TYPE, ACTION_TARGET_TYPE} = require('../constant/types');

  const ThumbSchema = new Schema({
    // 标签名称
    actor: { type: Schema.Types.ObjectId, refPath: 'actorType' },
    actorType: { type: String, enum: Object.values(ACTION_ACTOR_TYPE) },
    target: { type: Schema.Types.ObjectId, refPath: 'targetType', autopopulate: true  },
    targetType: { type: String, enum: Object.values(ACTION_TARGET_TYPE) },
    pageType: { type: String },
    subPageType: { type: String },
    context: { type: Object },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    value: { type: Boolean }
  });

  // 对标签名进行唯一索引
  ThumbSchema.index({ actor: 1 });
  ThumbSchema.index({ target: 1 });
  ThumbSchema.index({ actor: 1, target: 1, targetType: 1, actorType: 1 }, { unique: true });

  ThumbSchema.plugin(require('mongoose-autopopulate'));

  return mongoose.model('Thumb', ThumbSchema);
};
