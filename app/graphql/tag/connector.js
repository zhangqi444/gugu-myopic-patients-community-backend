'use strict';

const BasicConnector = require("../common/basicConnector");

const MODEL_NAME = 'Tag';

class TagConnector extends BasicConnector {
  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }
}

module.exports = TagConnector;

