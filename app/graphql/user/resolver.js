'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'user';
const MODEL_NAME = 'User';

module.exports = {
  Query: {
    userAdmin(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    usersAdmin(root, { option, condition }, ctx) {
      return ResolverHelper.fetchByIds(option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    async userLogin(root, { userLoginPayload }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].userLogin(userLoginPayload);
    },
    async userRich(root, { id }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].userRich(id);
    },
    // async userByToken(root, { accessToken }, ctx) {
    //   return await ctx.connector[CONNECTOR_NAME].userByToken(accessToken);
    // },
  },
  Mutation: {
    async onboardSelf(root, { id, userInput }, ctx) {
      return ctx.connector[CONNECTOR_NAME].onboardSelf(id, userInput);
    },
  }
};