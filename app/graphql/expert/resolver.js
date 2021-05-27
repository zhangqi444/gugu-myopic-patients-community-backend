'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'expert';
const MODEL_NAME = 'Expert';

module.exports = {
  Query: {
    expert(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    experts(root, { option, condition }, ctx) {
      return ResolverHelper.fetchByIds(option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
  Mutation: {
    addExpertAdmin(root, { expertInput }, ctx) {
      return ResolverHelper.add(expertInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    updateExpertAdmin(root, { id, expertInput }, ctx) {
      return ResolverHelper.update(id, expertInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    deleteExpertAdmin(root, { id, expertInput }, ctx) {
      return ResolverHelper.delete(id, expertInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
};
