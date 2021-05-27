'use strict';

const BasicConnector = require("../common/basicConnector");

const MODEL_NAME = 'Topic';

class TopicConnector extends BasicConnector {
  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }
}

module.exports = TopicConnector;

