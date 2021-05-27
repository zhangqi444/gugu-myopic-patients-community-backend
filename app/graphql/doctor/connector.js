'use strict';

const DataLoader = require('dataloader');
const BasicConnector = require('../common/basicConnector');

const MODEL_NAME = 'Doctor';

class DoctorConnector extends BasicConnector {
  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }
}

module.exports = DoctorConnector;

