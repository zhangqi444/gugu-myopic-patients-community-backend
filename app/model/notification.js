'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const { ACTION_ACTOR_TYPE, ACTION_TARGET_TYPE } = require('../constant/types');
  const { NOTIFICATION_STATUS, NOTIFICATION_TYPE } = require('../constant/notification');

  const NotificationSchema = new Schema({
    actor: { type: Schema.Types.ObjectId, refPath: 'actorType', autopopulate: true },
    actorType: { type: String, enum: Object.values(ACTION_ACTOR_TYPE) },
    target: { type: Schema.Types.ObjectId, refPath: 'targetType', autopopulate: true },
    targetType: { type: String, enum: Object.values(ACTION_TARGET_TYPE) },
    user: { type: Schema.Types.ObjectId, ref: 'User' }, // notification的所有者
    type: { type: String, enum: Object.values(NOTIFICATION_TYPE) },
    status: { type: String, enum: Object.values(NOTIFICATION_STATUS), default: NOTIFICATION_STATUS.INIT },
    context: { type: Object },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  });

  // 对标签名进行唯一索引
  NotificationSchema.index({ actor: 1 });
  NotificationSchema.index({ user: 1 });
  NotificationSchema.index({ target: 1 });
  NotificationSchema.index({ actor: 1, target: 1, targetType: 1, actorType: 1, user: 1, type: 1 });

  NotificationSchema.plugin(require('mongoose-autopopulate'));

  return mongoose.model('Notification', NotificationSchema);
};
