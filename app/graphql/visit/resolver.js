'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'visit';
const MODEL_NAME = 'Visit';

module.exports = {
  Query: {
    visit(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    visits(root, { option }, ctx) {
      return ResolverHelper.fetchByIds(option, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
  Mutation: {
    async addVisit(root, { visitInput }, ctx) {
      return await ctx.connector[CONNECTOR_NAME].add(visitInput);
    },
  }
};
