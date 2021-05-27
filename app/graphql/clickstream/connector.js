'use strict';

const BasicConnector = require('../common/basicConnector');

const MODEL_NAME = 'Clickstream';

class ClickstreamConnector extends BasicConnector {
  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }
}

module.exports = ClickstreamConnector;

