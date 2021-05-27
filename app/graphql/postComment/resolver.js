'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'postComment';
const MODEL_NAME = 'PostComment';

module.exports = {
  Query: {
    postComment(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    async postComments(root, { option, condition }, ctx) {
      return ResolverHelper.fetchByIds(option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    async postCommentsBySelf(root, { userId, option, condition }, ctx) {
      return ctx.connector[CONNECTOR_NAME].fetchPostCommentsBySelf(userId, option, condition);
    },
    async postCommentsByPost(root, { id, userId, option, condition }, ctx) {
      return ctx.connector[CONNECTOR_NAME].fetchPostCommentsByPost(id, null, userId, false, option, condition);
    },
    async nestedPostCommentsByPostComment(root, { postId, postCommentId, userId, option, condition }, ctx) {
      return ctx.connector[CONNECTOR_NAME].fetchPostCommentsByPost(postId, postCommentId, userId, true, option, condition);
    },
  },
  Mutation: {
    async addPostComment(root, { postCommentInput }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].add(postCommentInput);
    },
    deletePostComment(root, { id, postCommentInput }, ctx) {
      return ctx.connector[CONNECTOR_NAME].delete(id, postCommentInput);
    },
  },
};
