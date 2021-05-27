'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'doctor';
const MODEL_NAME = 'Doctor';

module.exports = {
  Query: {
    doctor(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    async doctors(root, { option, condition }, ctx) {
      return ResolverHelper.fetchByIds(option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
  Mutation: {
    addDoctor(root, { doctorInput }, ctx) {
      return ResolverHelper.add(doctorInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    updateDoctor(root, { id, doctorInput }, ctx) {
      return ResolverHelper.update(id, doctorInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    deleteDoctor(root, { id, doctorInput }, ctx) {
      return ResolverHelper.delete(id, doctorInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
  },
};
