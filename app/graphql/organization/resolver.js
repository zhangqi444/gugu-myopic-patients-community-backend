'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'organization';
const MODEL_NAME = 'Organization';

module.exports = {
  Query: {
    organization(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    async organizations(root, { option, condition }, ctx) {
      return await ResolverHelper.fetchByIds(option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
  Mutation: {
    addOrganization(root, { organizationInput }, ctx) {
      return ResolverHelper.add(organizationInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    updateOrganization(root, { id, organizationInput }, ctx) {
      return ResolverHelper.update(id, organizationInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    deleteOrganization(root, { id, organizationInput }, ctx) {
      return ResolverHelper.delete(id, organizationInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
};
