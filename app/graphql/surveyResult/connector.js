'use strict';

const BasicConnector = require('../common/basicConnector');
const { TYPE } = require('../../constant/surveyResult');
const { MODEL_NAMES } = require('../../constant/models');

const MODEL_NAME = 'SurveyResult';

class SurveyResultConnector extends BasicConnector {
  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }

  async add(input) {
    // TODO: add promise.all
    const result = await this.ctx.model[this.model].create(
      [ { ...input, isCompleted: true } ]
    );
    const survey = await this.ctx.model[MODEL_NAMES.SURVEY].findByIdAndUpdate(
      input.survey,
      { $inc: {'completeCount': 1} },
      { new: true }
    );
    return survey && result[0];
  }

  async update(id, surveyResultInput) {
    if (surveyResultInput.isCompleted) {
      surveyResultInput.summary = _generateSummary(surveyResultInput.result)
    }
    return await this.ctx.model[this.model].findByIdAndUpdate(
      { _id: id },
      surveyResultInput,
      { upsert: false, new: true, setDefaultsOnInsert: true }
    );
  }
}

module.exports = SurveyResultConnector;

