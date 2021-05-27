'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'survey';
const MODEL_NAME = 'Survey';

module.exports = {
  Query: {
    survey(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    surveys(root, { option, condition }, ctx) {
      return ResolverHelper.fetchByIds(option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
  Mutation: {
    addSurveyAdmin(root, { surveyInput }, ctx) {
      return ResolverHelper.add(surveyInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    updateSurveyAdmin(root, { id, surveyInput }, ctx) {
      return ResolverHelper.update(id, surveyInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    deleteSurveyAdmin(root, { id, surveyInput }, ctx) {
      return ResolverHelper.delete(id, surveyInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
};
