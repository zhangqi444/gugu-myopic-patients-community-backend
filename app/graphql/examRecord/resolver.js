'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'examRecord';
const MODEL_NAME = 'ExamRecord';

module.exports = {
  Query: {
    examRecord(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    examRecords(root, { option, condition }, ctx) {
      return ResolverHelper.fetchByIds(option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    }
  },
  Mutation: {
    addExamRecordAdmin(root, { examRecordInput }, ctx) {
      return ResolverHelper.add(examRecordInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    updateExamRecordAdmin(root, { id, examRecordInput }, ctx) {
      return ResolverHelper.update(id, examRecordInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    deleteExamRecordAdmin(root, { id, examRecordInput }, ctx) {
      return ResolverHelper.delete(id, examRecordInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    }
  },
};
