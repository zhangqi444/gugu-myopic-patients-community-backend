'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const { ACTION_ACTOR_TYPE } = require('../constant/types');
  const { SECURITY_CHECK_STATUS } = require('../constant/common');
  const Schema = mongoose.Schema;
  const mongoosastic = require('mongoosastic');

  const CommentSchema = new Schema({

    // 内容
    content: { type: String, es_indexed: true },
    // 点赞数量
    thumbCount: { type: Number, default: 0 },
    // 回复数量
    commentCount: { type: Number, default: 0 },
    // 收藏数量
    collectCount: { type: Number, default: 0 },

    article: { type: Schema.Types.ObjectId, ref: 'Article' }, // 指向该评论所属的文章
    isNestedComment: { type: Boolean, default: false }, // 是否是评论的回复
    comment: { type: Schema.Types.ObjectId, ref: 'Comment' }, // 如果该评论是某评论的回复，指向所属的评论
    nestedComment: { type: Schema.Types.ObjectId, ref: 'Comment' }, // 如果该评论是某评论的回复的回复，指向所回复的评论

    securityCheckStatus: { type: String, enum: Object.values(SECURITY_CHECK_STATUS), required: true },

    // 发布者
    officialUser: { type: Schema.Types.ObjectId, ref: 'OfficialUser', autopopulate: true },
    expert: { type: Schema.Types.ObjectId, ref: 'Expert', autopopulate: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', autopopulate: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', autopopulate: true },
    authorType: { type: String, enum: Object.values(ACTION_ACTOR_TYPE), required: true },

    // 是否被锁定
    isBlocked: { type: Boolean, default: false },
    // 是否被删除
    isDeleted: { type: Boolean, default: false },
    // 创建时间
    createdAt: { type: Date, default: Date.now },
    // 更新时间
    updatedAt: { type: Date, default: Date.now },
  });

  // 对创建时间进行索引
  CommentSchema.index({ createdAt: -1 });
  // 对文章作者进行索引
  CommentSchema.index({ officialUser: 1, createdAt: -1 });
  CommentSchema.index({ expert: 1, createdAt: -1 });
  CommentSchema.index({ doctor: 1, createdAt: -1 });
  CommentSchema.index({ user: 1, createdAt: -1 });
  CommentSchema.index({ article: 1, createdAt: -1 });
  CommentSchema.plugin(mongoosastic, {
    filter: function(doc) {
      return doc.isDeleted === true || doc.isBlocked === true;
    }
  });
  CommentSchema.plugin(require('mongoose-autopopulate'));

  const model = mongoose.model('Comment', CommentSchema);

  // 需要为已有的内容创建elasticsearch index时使用
  // const stream = model.synchronize(function (e) {
  //   console.error('Synchronize error: ' + e)
  // });

  return model;
};
