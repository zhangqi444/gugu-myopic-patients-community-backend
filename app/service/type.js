'use strict';

const Service = require('egg').Service;
const { MODEL_NAMES } = require('../constant/models');
const { ACTION_ACTOR_TYPE, ACTION_TARGET_TYPE } = require('../constant/types');

class TypeService extends Service {
  getModelNameByActionTargetType(targetType) {
    let modelName;
    switch (targetType) {
      case ACTION_TARGET_TYPE.ARTICLE: modelName = MODEL_NAMES.ARTICLE; break;
      case ACTION_TARGET_TYPE.POST: modelName = MODEL_NAMES.POST; break;
      case ACTION_TARGET_TYPE.COMMENT: modelName = MODEL_NAMES.COMMENT; break;
      case ACTION_TARGET_TYPE.POST_COMMENT: modelName = MODEL_NAMES.POST_COMMENT; break;
      default: break;
    }
    return modelName;
  }

  getModelNameByActionActorType(actorType) {
    let modelName;
    switch (actorType) {
      case ACTION_ACTOR_TYPE.USER: modelName = MODEL_NAMES.USER; break;
      case ACTION_ACTOR_TYPE.DOCTOR: modelName = MODEL_NAMES.DOCTOR; break;
      case ACTION_ACTOR_TYPE.OFFICIAL_USER: modelName = MODEL_NAMES.OFFICIAL_USER; break;
      case ACTION_ACTOR_TYPE.EXPERT: modelName = MODEL_NAMES.EXPERT; break;
      default: break;
    }
    return modelName;
  }
}

module.exports = TypeService;
