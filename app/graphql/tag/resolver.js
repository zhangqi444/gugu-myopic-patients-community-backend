'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'tag';
const MODEL_NAME = 'Tag';

module.exports = {
  Query: {
    tag(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    async tags(root, { option, condition }, ctx) {
      return await ResolverHelper.fetchByIds(option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
  Mutation: {
    addTag(root, { tagInput }, ctx) {
      return ResolverHelper.add(tagInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    updateTag(root, { id, tagInput }, ctx) {
      return ResolverHelper.update(id, tagInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    deleteTag(root, { id, tagInput }, ctx) {
      return ResolverHelper.delete(id, tagInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
};
