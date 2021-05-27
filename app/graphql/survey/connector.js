'use strict';

const BasicConnector = require('../common/basicConnector');

const MODEL_NAME = 'Survey';

class SurveyConnector extends BasicConnector {
  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }
}

module.exports = SurveyConnector;

