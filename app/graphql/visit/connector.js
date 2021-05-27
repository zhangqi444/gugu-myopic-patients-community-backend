'use strict';

const BasicConnector = require('../common/basicConnector');
const { MODEL_NAMES } = require('../../constant/models');

const MODEL_NAME = MODEL_NAMES.VISIT;

class VisitConnector extends BasicConnector {
  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }

  /**
   * 可以重复访问同一对象。
   * @param {object} input 
   */
  async add(input) {
    
    const { target, targetType } = input;
    const result = await this.ctx.model[this.model].create(
      [ { ...input, value: true } ]
    );

    if(result && result[0]) {
      let targetModelName = this.ctx.service.type.getModelNameByActionTargetType(targetType);;

      if(targetModelName) {
        await this.ctx.model[targetModelName].findByIdAndUpdate(
          target,
          { $inc: {'visitCount': 1} },
          { new: true }
        );
      }
    }

    return result[0];
  }

}

module.exports = VisitConnector;

