'use strict';
const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'surveyResult';
const MODEL_NAME = 'SurveyResult';

module.exports = {
  Query: {
    surveyResultAdmin(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    surveyResultsAdmin(root, { option, condition }, ctx) {
      return ResolverHelper.fetchByIds(option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    surveyResultsBySelf(root, { userId, option, condition }, ctx) {
      return ResolverHelper.fetchBySelf(userId, option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    }
  },
  Mutation: {
    addSurveyResult(root, { surveyResultInput }, ctx) {
      return ctx.connector[CONNECTOR_NAME].add(surveyResultInput);
    },

    updateSurveyResult(root, { id, surveyResultInput }, ctx) {
      return ctx.connector[CONNECTOR_NAME].update(id, surveyResultInput);
    },
  },
};
