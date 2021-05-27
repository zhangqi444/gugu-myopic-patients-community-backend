'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'officialUser';
const MODEL_NAME = 'OfficialUser';

module.exports = {
  Query: {
    officialUser(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    async officialUsers(root, { option, condition }, ctx) {
      return await ResolverHelper.fetchByIds(option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
  Mutation: {
    addOfficialUser(root, { officialUserInput }, ctx) {
      return ResolverHelper.add(officialUserInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    updateOfficialUser(root, { id, officialUserInput }, ctx) {
      return ResolverHelper.update(id, officialUserInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    deleteOfficialUser(root, { id, officialUserInput }, ctx) {
      return ResolverHelper.delete(id, officialUserInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
};
