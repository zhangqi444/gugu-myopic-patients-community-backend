'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const VisitSchema = new Schema({
    // 标签名称
    actor: { type: Schema.Types.ObjectId },
    actorType: { type: String },
    target: { type: Schema.Types.ObjectId },
    targetType: { type: String },
    pageType: { type: String },
    subPageType: { type: String },
    context: { type: Object },
    createdAt: { type: Date, default: Date.now },
    isDeleted: { type: Boolean },
    value: { type: Boolean }
  });

  // 对标签名进行唯一索引
  VisitSchema.index({ actor: 1 });
  VisitSchema.index({ target: 1 });
  VisitSchema.index({ actor: 1, target: 1, targetType: 1, actorType: 1 });

  return mongoose.model('Visit', VisitSchema);
};
