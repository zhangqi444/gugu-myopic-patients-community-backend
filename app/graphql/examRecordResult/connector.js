'use strict';

const BasicConnector = require('../common/basicConnector');

const MODEL_NAME = 'ExamRecordResult';

class ExamRecordResultConnector extends BasicConnector {
  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }
}

module.exports = ExamRecordResultConnector;

