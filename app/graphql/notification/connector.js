'use strict';

const BasicConnector = require('../common/basicConnector');
const { NOTIFICATION_STATUS } = require('../../constant/notification');
const { result } = require('lodash');

const MODEL_NAME = 'Notification';

class NotificationConnector extends BasicConnector {
  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }

  async fetchBySelf(userId, option, condition) {
    let result = await super.fetchBySelf(userId, option, condition);
    return result.map(r => this.ctx.service.action.parseAction(r));
  }

  async summary(userId) {
    return await super.summary(userId, { status: NOTIFICATION_STATUS.INIT });
  }

  async viewNotificationsBySelf(userId) {
    const result = await this.ctx.model[MODEL_NAME].updateMany(
      { user: userId, status: NOTIFICATION_STATUS.INIT, isDeleted: false, isBlocked: false },
      { status: NOTIFICATION_STATUS.VIEWED, updatedAt: Date.now() }
    );

    return !!result;
  }
} 

module.exports = NotificationConnector;

