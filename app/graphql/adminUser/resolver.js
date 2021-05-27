'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'adminUser';
const MODEL_NAME = 'AdminUser';

module.exports = {
  Query: {
    adminUser(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    adminUsers(root, { option, condition }, ctx) {
      return ResolverHelper.fetchByIds(option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    async adminUserLogin(root, { email, password }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].adminUserLogin(email, password);
    },
    async adminUserByToken(root, { }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].adminUserByToken();
    },
  },
  Mutation: {
    async adminUserLogout(root, { }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].adminUserLogout();
    },
  }
};