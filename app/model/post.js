'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const mongoosastic = require('mongoosastic');
  const OfficialUser = require('./officialUser');
  const Expert = require('./expert');
  const Doctor = require('./doctor');
  const User = require('./user');
  const { ACTION_ACTOR_TYPE } = require('../constant/types');
  const { SECURITY_CHECK_STATUS } = require('../constant/common');
  const { POST_TYPE, POST_MEDIA_TYPE } = require('../constant/post');
  const Schema = mongoose.Schema;

  const PostSchema = new Schema({

    mediaType: { type: String, enum: Object.values(POST_MEDIA_TYPE) },
    type: { type: String, enum: Object.values(POST_TYPE), default: POST_TYPE.DEFAULT },

    title: { type: String, es_indexed: true },
    content: { type: String, es_indexed: true },
    tags: { type: Array, default: [], ref: 'Tag', es_indexed: true },
    topics: { type: Array, default: [], ref: 'Topic', es_indexed: true },
    circle: { type: Schema.Types.ObjectId, ref: 'Circle', es_indexed: true },
    
    securityCheckStatus: { type: String, enum: Object.values(SECURITY_CHECK_STATUS), required: true },

    thumbCount: { type: Number, default: 0 },
    shareCount: { type: Number, default: 0 },
    visitCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    collectCount: { type: Number, default: 0 },

    // 发布者
    officialUser: { type: Schema.Types.ObjectId, ref: 'OfficialUser', es_schema: OfficialUser, es_indexed: true, autopopulate: true },
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor', es_schema: Doctor, es_indexed: true, autopopulate: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', es_schema: User, es_indexed: true, autopopulate: true },
    expert: { type: Schema.Types.ObjectId, ref: 'Expert', es_schema: Expert, es_indexed: true, autopopulate: true },
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

  PostSchema.index({ createdAt: -1 });
  PostSchema.index({ officialUser: 1, createdAt: -1 });
  PostSchema.index({ expert: 1, createdAt: -1 });
  PostSchema.index({ doctor: 1, createdAt: -1 });
  PostSchema.index({ user: 1, createdAt: -1 });
  PostSchema.index({ tags: 1, createdAt: -1 });
  PostSchema.index({ topics: 1, createdAt: -1 });
  PostSchema.index({ cicle: 1, createdAt: -1 });

  PostSchema.plugin(mongoosastic, {
    filter: function(doc) {
      return doc.isDeleted === true || doc.isBlocked === true;
    }
  });
  PostSchema.plugin(mongoosastic, {
    filter: function(doc) {
      return doc.isDeleted === true || doc.isBlocked === true;
    }
  });
  PostSchema.plugin(require('mongoose-autopopulate'));

  const model = mongoose.model('Post', PostSchema);

  // 需要为已有的内容创建elasticsearch index时使用
  // const stream = model.synchronize(function (e) {
  //   console.error('Synchronize error: ' + e)
  // });

  return model;
};
