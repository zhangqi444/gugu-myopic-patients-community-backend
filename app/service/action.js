'use strict';

const Service = require('egg').Service;
const { MODEL_NAMES } = require('../constant/models');
const { ACTION_ACTOR_TYPE, ACTION_TARGET_TYPE } = require('../constant/types');

class ActionService extends Service {

  _getAssociatedFieldName(model) {
    let fieldName;
    switch (model) {
      case MODEL_NAMES.VISIT: fieldName = 'visitCount'; break;
      case MODEL_NAMES.COLLECT: fieldName = 'collectCount'; break;
      case MODEL_NAMES.THUMB: fieldName = 'thumbCount'; break;
      default: break;
    }
    return fieldName;
  }

  parseAction(action) {
    return { ...action, actor: this.parseActionActor(action), target: this.parseActionTarget(action) };
  }

  parseActionActor(action) {
    let key;
    switch(action.actorType) {
      case ACTION_ACTOR_TYPE.USER: key = 'user'; break;
      case ACTION_ACTOR_TYPE.OFFICIAL_USER: key = 'officialUser'; break;
      case ACTION_ACTOR_TYPE.DOCTOR: key = 'doctor'; break;
      case ACTION_ACTOR_TYPE.EXPERT: key = 'expert'; break;
      default: break;
    }

    return key && { [key]: action.actor };
  }

  parseActionTarget(action) {
    let key;
    switch(action.actorType) {
      case ACTION_TARGET_TYPE.POST: key = 'post'; break;
      case ACTION_ACTOR_TYPE.ARTICLE: key = 'article'; break;
      case ACTION_ACTOR_TYPE.USER: key = 'user'; break;
      case ACTION_ACTOR_TYPE.COMMENT: key = 'comment'; break;
      case ACTION_ACTOR_TYPE.POST_COMMENT: key = 'postComment'; break;
      default: break;
    }

    return key && { [key]: action.target };
  }

  async add(input, model) {
    const { target, targetType, actor, actorType, value } = input;
    const now = Date.now();
    const action = await this.ctx.model[model].findOneAndUpdate(
      { target, targetType, actor, actorType, value: !value },
      { value, updatedAt: now },
      { upsert: true, returnOriginal: true, rawResult: true }
    );
    let modelName = this.ctx.service.type.getModelNameByActionTargetType(targetType);
    const lastErrorObject = action && action.lastErrorObject;

    let result = action && action.value && action.value._doc;
    result = {
      ...result, updatedAt: now, value, 
      _id: (result && result._id) ? result._id : lastErrorObject.upserted
    };

    this.ctx.service.notification.addAction(result, model);
    
    if(action && lastErrorObject.updatedExisting && modelName) {
      const fieldName = this._getAssociatedFieldName(model);
      await this.ctx.model[modelName].findByIdAndUpdate(
        target,
        { $inc: { [fieldName]: value ? 1 : -1} },
        { new: true }
      );
    }

    return result;
  }
}

module.exports = ActionService;
