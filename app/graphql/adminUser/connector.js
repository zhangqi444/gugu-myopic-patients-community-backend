'use strict';

const BasicConnector = require('../common/basicConnector');
const errorCode = require('../../error/errorCode');
const { CLIENTS } = require('../../constant/constants');

const MODEL_NAME = 'AdminUser';

class AdminUserConnector extends BasicConnector {

  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }

  async adminUserLogin(email, password) {
    const user = await this.ctx.model[this.model].findOne(
      {
        isDeleted: false,
        isBlocked: false,
        email,
        password
      }
    );
    if (!user) {
      this.ctx.response.body = {
        error: "Fail to auth request: " + this.ctx.request.body.operationName,
        code: errorCode.GLOBAL_AUTH_FAILED_TO_AUTH_ADMIN
      };
      return;
    }
    const accessToken = await this.ctx.service.token.signJwt({ email, clientType: CLIENTS.GUGU_ADMIN });
    this.ctx.cookies.set('accessToken', accessToken, { signed: false, encrypt: true });
    return user;
  }

  async adminUserByToken() {
    const user = await this.ctx.service.auth.check();
    if (!user) {
      this.ctx.response.body = {
        error: "Fail to auth request: " + this.ctx.request.body.operationName,
        code: errorCode.GLOBAL_AUTH_FAILED_TO_AUTH_ADMIN
      };
      this.ctx.cookies.set('accessToken');
      return;
    }
    return user;
  }

  async adminUserLogout() {
    const user = await this.ctx.service.auth.check();
    if (!user) {
      this.ctx.response.body = {
        error: "Fail to auth request: " + this.ctx.request.body.operationName,
        code: errorCode.GLOBAL_AUTH_FAILED_TO_AUTH_ADMIN
      };
      return
    }
    this.ctx.cookies.set('accessToken');
    return user._id;
  }
}
module.exports = AdminUserConnector;
