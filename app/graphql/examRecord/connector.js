'use strict';

const BasicConnector = require('../common/basicConnector');

const MODEL_NAME = 'ExamRecord';

class ExamRecordConnector extends BasicConnector {
  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }
}

module.exports = ExamRecordConnector;

