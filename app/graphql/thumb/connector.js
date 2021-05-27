'use strict';

const BasicConnector = require('../common/basicConnector');

const MODEL_NAME = 'Thumb';

class ThumbConnector extends BasicConnector {
  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }

  async add(input) {
    return await this.ctx.service.action.add(input, MODEL_NAME);
  }
}

module.exports = ThumbConnector;

