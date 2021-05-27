'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'clickstream';
const MODEL_NAME = 'Clickstream';

module.exports = {
  Query: {
    clickstream(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    clickstreams(root, { option }, ctx) {
      return ResolverHelper.fetchByIds(option, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
  Mutation: {
    addClickstream(root, { clickstreamInput }, ctx) {
      return ctx.connector[CONNECTOR_NAME].addClickstream(clickstreamInput);
    },
  }
};
