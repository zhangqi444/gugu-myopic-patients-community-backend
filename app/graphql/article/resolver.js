'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'article';
const MODEL_NAME = 'Article';

module.exports = {
  Query: {
    article(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    async articleRich(root, { id, userId, option, condition }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].fetchRichById(id, userId, option, condition);
    },
    async articles(root, { option, condition }, ctx) {
      return ResolverHelper.fetchByIds(option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    async articlesByTags(root, { tags, option, condition }, ctx) {
      return ctx.connector[CONNECTOR_NAME].fetchByTags(tags, option, condition);
    },
    async articlesByAnyTags(root, { tags, option, condition }, ctx) {
      return ctx.connector[CONNECTOR_NAME].fetchByAnyTags(tags, option, condition);
    },
    async articlesBySearch(root, { query, option, condition }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].fetchBySearch(query, option, condition);
    }
  },
  Mutation: {
    addArticle(root, { articleInput }, ctx) {
      return ResolverHelper.add(articleInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    updateArticle(root, { id, articleInput }, ctx) {
      return ResolverHelper.update(id, articleInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    deleteArticle(root, { id, articleInput }, ctx) {
      return ResolverHelper.delete(id, articleInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
};
