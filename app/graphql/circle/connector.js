'use strict';

const BasicConnector = require("../common/basicConnector");

const MODEL_NAME = 'Circle';

class CircleConnector extends BasicConnector {
  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }
}

module.exports = CircleConnector;

