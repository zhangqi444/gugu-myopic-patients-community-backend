'use strict';

const Service = require('egg').Service;

class ClickstreamService extends Service {
  async add(input) {
    const result = await this.ctx.model['Clickstream'].create(
      [ input ]
    );
    return result && result[0];
    
  }
}

module.exports = ClickstreamService;
