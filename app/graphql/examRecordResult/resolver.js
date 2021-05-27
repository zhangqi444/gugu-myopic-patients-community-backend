'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'examRecordResult';
const MODEL_NAME = 'ExamRecordResult';

module.exports = {
  Query: {
    examRecordResultAdmin(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    examRecordResultsAdmin(root, { option, condition }, ctx) {
      return ResolverHelper.fetchByIds(option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    examRecordResultsBySelf(root, { userId, option, condition }, ctx) {
      return ResolverHelper.fetchBySelf(userId, option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    }
  },
  Mutation: {
    addExamRecordResult(root, { examRecordResultInput }, ctx) {
      return ResolverHelper.add(examRecordResultInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    updateExamRecordResult(root, { id, examRecordResultInput }, ctx) {
      return ResolverHelper.update(id, examRecordResultInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    deleteExamRecordResult(root, { id, examRecordResultInput }, ctx) {
      return ResolverHelper.delete(id, examRecordResultInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
};
