'use strict';

const BasicConnector = require('../common/basicConnector');
const {ACTION_ACTOR_TYPE, ACTION_TARGET_TYPE} = require('../../constant/types');

const MODEL_NAME = 'Collect';

class CollectConnector extends BasicConnector {
  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }

  async fetchCollectsBySelf(userId) {
    let result = await this.ctx.model[this.model].find({
      actor: userId, value: true
    }).populate('target').exec();
    result = result && result.map(r => {
      let targetRef;
      // TODO: 切换到使用ctx.helper
      switch (r.targetType) {
        case ACTION_TARGET_TYPE.ARTICLE:
          targetRef = { article: r.target };
          break;
      
        default:
          break;
      }
      return { ...r._doc, target: targetRef };
    });
    return result.filter(r => r.target && r.actor);
  }

  async add(input) {
    return await this.ctx.service.action.add(input, MODEL_NAME);
  }
}

module.exports = CollectConnector;

