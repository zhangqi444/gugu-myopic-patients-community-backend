'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'circle';
const MODEL_NAME = 'Circle';

module.exports = {
  Query: {
    circle(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    async circles(root, { option, condition }, ctx) {
      return await ResolverHelper.fetchByIds(option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
  Mutation: {
    addCircleAdmin(root, { circleInput }, ctx) {
      return ResolverHelper.add(circleInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    updateCircleAdmin(root, { id, circleInput }, ctx) {
      return ResolverHelper.update(id, circleInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    deleteCircleAdmin(root, { id, circleInput }, ctx) {
      return ResolverHelper.delete(id, circleInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
};
