'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'thumb';
const MODEL_NAME = 'Thumb';

module.exports = {
  Query: {
    thumb(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    thumbs(root, { option }, ctx) {
      return ResolverHelper.fetchByIds(option, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
  Mutation: {
    async addThumb(root, { thumbInput }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].add(thumbInput);
    },
  }
};
