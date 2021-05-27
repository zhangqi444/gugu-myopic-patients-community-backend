'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'topic';
const MODEL_NAME = 'Topic';

module.exports = {
  Query: {
    topic(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    async topics(root, { option, condition }, ctx) {
      return await ResolverHelper.fetchByIds(option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
  Mutation: {
    addTopicAdmin(root, { topicInput }, ctx) {
      return ResolverHelper.add(topicInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    updateTopicAdmin(root, { id, topicInput }, ctx) {
      return ResolverHelper.update(id, topicInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    deleteTopicAdmin(root, { id, topicInput }, ctx) {
      return ResolverHelper.delete(id, topicInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
};
