'use strict'; 

module.exports = app => {
  const { ONBOARDING_STATUS } = require('../constant/user');
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  var credentialSchema = mongoose.Schema({
    clientType: String,
    openId: String,
    unionId: String,
    sessionKey: String, // wechat only
    accessToken: String, // internal access
  },{ _id : false });

  const UserSchema = new Schema({
    /*
      ----用户基本信息----
    */
    // 用户昵称
    nickname: { type: String },
    // 用户手机号码
    phone: { type: String },
    // 用户性别
    gender: { type: Number },
    // 用户邮箱
    email: { type: String },
    // 用户头像
    avatar: { type: String },
    // 用户密码
    password: { type: String },
    // 用户省份
    province: { type: String },
    // 用户城市
    city: { type: String },
    language: { type: String },
    country: { type: String },
    // 用户出生年份
    birthYear: { type: String },
    // 个人简介
    introduction: { type: String },
    // 用户真实姓名
    realname: { type: String },

    credential: [credentialSchema],

    onboardingStatus: { type: String, enum: Object.values(ONBOARDING_STATUS), default: ONBOARDING_STATUS.DEFAULT },
    circles: { type: Array, ref: 'Circle' },
    
    /*
      ----用户风控信息----
    */
    // 是否被锁定
    isBlocked: { type: Boolean, default: false },
    // 是否被删除
    isDeleted: { type: Boolean, default: false },
    // 创建时间
    createdAt: { type: Date, default: Date.now },
    // 更新时间
    updatedAt: { type: Date, default: Date.now },
    loginedAt: { type: Date, default: Date.now },
  });

  UserSchema.index({ "credential.openId": 1, "credential.openId": 1 });
  UserSchema.index({ accessToken: 1 });

  return mongoose.model('User', UserSchema);
};
