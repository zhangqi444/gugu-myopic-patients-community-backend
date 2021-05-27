'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'comment';
const MODEL_NAME = 'Comment';

module.exports = {
  Query: {
    comment(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    async comments(root, { option, condition }, ctx) {
      return ResolverHelper.fetchByIds(option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    async commentsBySelf(root, { userId, option, condition }, ctx) {
      return ctx.connector[CONNECTOR_NAME].fetchCommentsBySelf(userId, option, condition);
    },
    async commentsByArticle(root, { id, userId, option, condition }, ctx) {
      return ctx.connector[CONNECTOR_NAME].fetchCommentsByArticle(id, null, userId, false, option, condition);
    },
    async nestedCommentsByComment(root, { articleId, commentId, userId, option, condition }, ctx) {
      return ctx.connector[CONNECTOR_NAME].fetchCommentsByArticle(articleId, commentId, userId, true, option, condition);
    },
  },
  Mutation: {
    async addComment(root, { commentInput }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].add(commentInput);
    },
    deleteComment(root, { id, commentInput }, ctx) {
      return ctx.connector[CONNECTOR_NAME].delete(id, commentInput);
    },
  },
};
