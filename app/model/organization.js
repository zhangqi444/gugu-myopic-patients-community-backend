'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const OrganizationSchema = new Schema({
    // 组织名称
    name: { type: String },
    // 用户手机号码
    phone: { type: String },
    // 组织别名
    alias: { type: Array, default: [] },
    // 组织所有制，包括PUBLIC、PRIVATE
    property: { type: String },
    // 组织类型，包括HOSPITAL、COMPANY
    type: { type: String },
    // 组织资质，包括3A
    classification: { type: String },
    // 其他组织资质，如专科医院
    otherClassification: { type: Array, default: [] },
    province: { type: String },
    city: { type: String },
    location: { type: String },
    introduction: { type: String },
    registration: { type: String },
    // 组织排名
    rank: { type: Array, default: [] },
    website: { type: String },
    route: { type: String },
    // 组织头像
    avatar: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    // 是否被锁定
    isBlocked: { type: Boolean, default: false },
    // 是否被删除
    isDeleted: { type: Boolean, default: false },
    // 账户是否被激活
    isActive: { type: Boolean, default: false },
    // 账户是否被激活
    isVerified: { type: Boolean, default: false },
  });

  OrganizationSchema.index({ name: 1});

  return mongoose.model('Organization', OrganizationSchema);
};
