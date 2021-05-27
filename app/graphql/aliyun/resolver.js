'use strict';

const CONNECTOR_NAME = 'aliyun';

module.exports = {
  Query: {
    async aliyunPutSignatureUrl(root, { name }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].fetchPutSignatureUrl(name);
    },
    async aliyunSignature(root, { }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].fetchSignature();
    }
  },
  Mutation: {
  }
};
