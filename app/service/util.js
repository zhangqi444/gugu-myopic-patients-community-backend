'use strict';

const Service = require('egg').Service;

class UtilService extends Service {
  async getClientType() {
    return this.ctx.request.headers['clienttype'];
  }

  convertCondition(condition) {
    var convertedProj = {};
    condition && Object.keys(condition).map(k => {
      convertedProj[k] = condition[k] || {$ne: true};
    });
    return convertedProj;
  }
}

module.exports = UtilService;
