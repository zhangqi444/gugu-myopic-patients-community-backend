'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const AdminUserSchema = new Schema({
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
    // 用户出生年份
    birthYear: { type: String },
    /*
      ----用户风控信息----
    */
    // 账户是否被屏蔽
    isBlocked: { type: Boolean, default: false },
    // 账户是否被激活
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    // 用户创建时间
    createdAt: { type: Date, default: Date.now },
    // 用户更新时间
    updatedAt: { type: Date, default: Date.now },

  });

  AdminUserSchema.index();

  return mongoose.model('AdminUser', AdminUserSchema);
};