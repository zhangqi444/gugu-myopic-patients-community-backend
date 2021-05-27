const { AUTHOR_TYPE, ACTION_TARGET_TYPE } = require('../constant/types');

module.exports = {
  parseMsg(action, payload = {}, metadata = {}) {
    const meta = Object.assign({}, {
      timestamp: Date.now(),
    }, metadata);

    return {
      meta,
      data: {
        action,
        payload,
      },
    };
  },

  parseAuthor(source) {
    if(!source) return;

    let key;
    switch(source.authorType) {
      case AUTHOR_TYPE.USER: key = 'user'; break;
      case AUTHOR_TYPE.OFFICIAL_USER: key = 'officialUser'; break;
      case AUTHOR_TYPE.DOCTOR: key = 'doctor'; break;
      case AUTHOR_TYPE.EXPERT: key = 'expert'; break;
      default: break;
    }

    return key && source[key];
  },

  typeToKey(type) {
    let key;
    switch(type) {
      case AUTHOR_TYPE.USER: key = 'user'; break;
      case AUTHOR_TYPE.OFFICIAL_USER: key = 'officialUser'; break;
      case AUTHOR_TYPE.DOCTOR: key = 'doctor'; break;
      case AUTHOR_TYPE.EXPERT: key = 'expert'; break;

      case ACTION_TARGET_TYPE.ARTICLE: key = 'article'; break;
      case ACTION_TARGET_TYPE.POST: key = 'post'; break;
      case ACTION_TARGET_TYPE.COMMENT: key = 'comment'; break;
      case ACTION_TARGET_TYPE.POST_COMMENT: key = 'postComment'; break;
      default: break;
    }

    return key;
  }
};