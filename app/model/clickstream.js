'use strict';

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const ClickstreamSchema = new Schema({
    metricsName: { type: String },
    metricsClass: { type: String },
    pageType: { type: String },
    subPageType: { type: String },
    refTag: { type: String },
    deviceType: { type: String },
    value: { type: String },
    createdAt: { type: Date, default: Date.now },
    metric: { type: String, required: true },
    serviceName: { type: String }, 
    methodName: { type: String }, 
    instance: { type: String },
    dataSet: { type: String }, // prod, gamma, local, e.g.
    client: { type: String }, // GUGU_WECHAT_MINI, GUGU_ADMIN, e.g.
    freeForm: { type: Object }
  });

  // 对标签名进行唯一索引
  ClickstreamSchema.index({ metric: 1 });
  ClickstreamSchema.index({ client: 1 });
  ClickstreamSchema.index({ serviceName: 1 });
  ClickstreamSchema.index({ metric: 1, client: 1, serviceName: 1 });

  return mongoose.model('Clickstream', ClickstreamSchema);
};
