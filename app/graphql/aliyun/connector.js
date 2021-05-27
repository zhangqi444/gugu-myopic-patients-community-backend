'use strict';

class AliyunConnector {
  constructor(ctx, model) {
    this.ctx = ctx;
    this.model = model;
  }

  async fetchPutSignatureUrl(name) {
    const signatureUrl = await this.ctx.service.aliyun.putSignatureUrl(name);
    return { signatureUrl };
  }

  async fetchSignature() {
    const signature = await this.ctx.service.aliyun.signature();
    return { signature };
  }
}

module.exports = AliyunConnector;

