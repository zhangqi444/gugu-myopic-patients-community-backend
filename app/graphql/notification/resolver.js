'use strict';

const ResolverHelper = require("../common/resolverHelper");

const CONNECTOR_NAME = 'notification';
const MODEL_NAME = 'Notification';

module.exports = {
  Query: {
    notificationAdmin(root, { id }, ctx) {
      return ResolverHelper.fetchById(id, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    notificationsAdmin(root, { option, condition }, ctx) {
      return ResolverHelper.fetchByIds(option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    async notificationsBySelf(root, { userId, option, condition }, ctx) {
      return ResolverHelper.fetchBySelf(userId, option, condition, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    async notificationSummary(root, { userId }, ctx) {
      return ctx.connector[CONNECTOR_NAME].summary(userId);
    },
  },
  Mutation: {
    addNotificationAdmin(root, { notificationInput }, ctx) {
      return ResolverHelper.add(notificationInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    updateNotification(root, { id, notificationInput }, ctx) {
      return ResolverHelper.update(id, notificationInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    deleteNotificationAdmin(root, { id, notificationInput }, ctx) {
      return ResolverHelper.delete(id, notificationInput, ctx, CONNECTOR_NAME, MODEL_NAME);
    },
    viewNotificationsBySelf(view, { userId }, ctx) {
      return ctx.connector[CONNECTOR_NAME].viewNotificationsBySelf(userId);
    },
  }
};
