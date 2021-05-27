'use strict';

const BasicConnector = require('../common/basicConnector');

const MODEL_NAME = 'Organization';

class OrganizationConnector extends BasicConnector {
  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }
}

module.exports = OrganizationConnector;

