'use strict';

const BasicConnector = require('../common/basicConnector');

const MODEL_NAME = 'OfficialUser';

class OfficialUserConnector extends BasicConnector {
  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }
}

module.exports = OfficialUserConnector;

