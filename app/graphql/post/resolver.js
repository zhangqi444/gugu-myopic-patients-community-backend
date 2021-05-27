'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'post';
const MODEL_NAME = 'Post';

module.exports = {
  Query: {
    post(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    posts(root, { userId, option, condition }, ctx) {
      return ResolverHelper.fetchByIds(userId, option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    async postRich(root, { id, userId }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].fetchRichById(id, userId);
    },
    async postsBySelf(root, { userId, option, condition }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].fetchBySelf(userId, option, condition);
    },
    async postsByCircles(root, { circles, userId, option, condition }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].fetchByCircles(circles, userId, option, condition);
    },
    async postsBySearch(root, { query, option, condition }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].fetchBySearch(query, option, condition);
    }
  },
  Mutation: {
    addPost(root, { postInput }, ctx) {
      return ctx.connector[CONNECTOR_NAME].add(postInput);
    },
    updatePost(root, { id, postInput }, ctx) {
      return ctx.connector[CONNECTOR_NAME].update(id, postInput);
    },
    deletePost(root, { id, postInput }, ctx) {
      return ctx.connector[CONNECTOR_NAME].delete(id, postInput);
    },
  },
};
