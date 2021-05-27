'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'collect';
const MODEL_NAME = 'Collect';

module.exports = {
  Query: {
    collect(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    collects(root, { option, condition }, ctx) {
      return ResolverHelper.fetchByIds(option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    async collectsBySelf(root, { userId, option, condition }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].fetchCollectsBySelf(userId, option, condition);
    }
  },
  Mutation: {
    async addCollect(root, { collectInput }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].add(collectInput);
    },
  }
};
