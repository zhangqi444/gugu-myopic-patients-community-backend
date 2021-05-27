'use strict';

const BasicConnector = require('../common/basicConnector');

const MODEL_NAME = 'Expert';

class ExpertConnector extends BasicConnector {
  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }
}

module.exports = ExpertConnector;

