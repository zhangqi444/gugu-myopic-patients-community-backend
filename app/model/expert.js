'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const subDepartmentSchema = mongoose.Schema({
    name: { type: String },
  }, { _id : false });

  const departmentSchema = mongoose.Schema({
    name: { type: String },
    subDepartments: [subDepartmentSchema],
    location: { type: String },
  }, { _id : false });

  const ExpertSchema = new Schema({
    /*
      ----用户基本信息----
    */
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
    birthYear: { type: Date },
    // 个人简介
    introduction: { type: String },
    // 用户真实姓名
    name: { type: String },
    /*
      ----特殊用户字段----
    */
    // 用户的职称
    title: { type: String },
    // 用户的组织机构
    organization: { type: Object, ref: 'Organization' },
    // 用户其它职称
    otherTitles: { type: Array, default: [] },
    departments: [departmentSchema],
    department: { type: String }, // deprecated
    // 专业资质
    qualification: { type: String },
    specialty: { type: String },
    specialtyTags: { type: Array, default: [] },
    tags: { type: Array, default: [], ref: 'Tag', es_indexed: true },

    /*
      ----用户风控信息----
    */
    // 账户是否被屏蔽
    isBlocked: { type: Boolean, default: false },
    // 账户是否被激活
    isActive: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    // 用户创建时间
    createdAt: { type: Date, default: Date.now },
    // 用户更新时间
    updatedAt: { type: Date, default: Date.now },

  });

  ExpertSchema.index();

  return mongoose.model('Expert', ExpertSchema);
};
