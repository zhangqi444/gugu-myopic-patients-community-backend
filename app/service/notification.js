'use strict';

const Service = require('egg').Service;
const { MODEL_NAMES } = require('../constant/models');
const { ACTION_TARGET_TYPE } = require('../constant/types');
const { NOTIFICATION_TYPE } = require('../constant/notification');

const NOTIFICATION_TYPE_MAP = {
  [MODEL_NAMES.THUMB]: {
    [MODEL_NAMES.ARTICLE]: NOTIFICATION_TYPE.THUMB_ARTICLE,
    [MODEL_NAMES.COMMENT]: NOTIFICATION_TYPE.THUMB_COMMENT,
    [MODEL_NAMES.POST]: NOTIFICATION_TYPE.THUMB_POST,
    [MODEL_NAMES.POST_COMMENT]: NOTIFICATION_TYPE.THUMB_POST_COMMENT,
  },
  [MODEL_NAMES.COLLECT]: {
    [MODEL_NAMES.ARTICLE]: NOTIFICATION_TYPE.COLLECT_ARTICLE,
    [MODEL_NAMES.POST]: NOTIFICATION_TYPE.COLLECT_POST,
  },
  [MODEL_NAMES.COMMENT]: {
    [MODEL_NAMES.ARTICLE]: NOTIFICATION_TYPE.COMMENT_ARTICLE,
    [MODEL_NAMES.COMMENT]: NOTIFICATION_TYPE.COMMENT_COMMENT,
  },
  [MODEL_NAMES.POST_COMMENT]: {
    [MODEL_NAMES.POST]: NOTIFICATION_TYPE.COMMENT_POST,
    [MODEL_NAMES.POST_COMMENT]: NOTIFICATION_TYPE.COMMENT_POST_COMMENT,
  },
};

class NotificationService extends Service {

  async addComment(commentObject, model) {
    if(!commentObject || !model) return;

    const { comment, article, post, nestedComment, authorType } = commentObject;

    let parent, parentType, parentCommentType, user;
    if(article) {
      parent = article;
      parentType = MODEL_NAMES.ARTICLE;
      parentCommentType = MODEL_NAMES.COMMENT;
    } else if(post) {
      parent = post;
      parentType = MODEL_NAMES.POST;
      parentCommentType = MODEL_NAMES.POST_COMMENT;
    } else {
      return;
    }

    const actor = this.ctx.helper.parseAuthor(commentObject)._id;
    const typeGroup = NOTIFICATION_TYPE_MAP[model];
    const basicInput = { type: typeGroup[parentCommentType], actorType: authorType, actor };
    const notifyList = [];

    // 给评论对应的文章的作者发送推送
    if(article) {
      user = this.ctx.helper.parseAuthor(article)._id;
      !actor.equals(user) && notifyList.push(
        this.add({ ...basicInput, type: typeGroup[parentType], target: parent, targetType: parentType, user })
      );
    }

    // 给回复对应的评论的作者发送推送
    if(comment) {
      user = this.ctx.helper.parseAuthor(comment)._id;
      !actor.equals(user) && notifyList.push(
        this.add({ ...basicInput, target: comment, targetType: parentCommentType, user })
      );
    }

    // 给回复对应的回复的作者发送推送
    if(nestedComment) {
      user = this.ctx.helper.parseAuthor(nestedComment)._id;
      !actor.equals(user) && notifyList.push(
        this.add({ ...basicInput, target: nestedComment, targetType: parentCommentType, user })
      );
    }

    await Promise.all(notifyList);
  }

  async addAction(action, model) {
    if(!action || !model) return;

    const { targetType, actorType, actor, target, value } = action;
    const type = NOTIFICATION_TYPE_MAP[model] && NOTIFICATION_TYPE_MAP[model][targetType];

    if(!type || !value) return;

    const targetAuthor = this.ctx.helper.parseAuthor(target);

    if(actor.equals(targetAuthor._id)) return;

    return await this.add({ type, targetType, actorType, actor, target: target._id, user: targetAuthor._id });
  }

  async add(input) {
    const { target, targetType, actor, actorType, user, type } = input;
    const result = await this.ctx.model[MODEL_NAMES.NOTIFICATION].create(
      [{ target, targetType, actor, actorType, user, type }]
    );

    return result[0];
  }
}

module.exports = NotificationService;
