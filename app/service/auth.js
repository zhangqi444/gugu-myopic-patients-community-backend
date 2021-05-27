'use strict';

const Service = require('egg').Service;
const { CLIENTS } = require('../constant/constants');
const errorCode = require('../error/errorCode');

class AuthService extends Service {

  async getClientType() {
    const {data, exp} = await this.getAccessToken();
    const { clientType } = data;
    return clientType;
  }

  async check(operatorId) {

    const { ctx } = this;

    try {
      const {data, exp} = await this.getAccessToken();

      const { clientType } = data;

      switch (clientType) {
        case CLIENTS.GUGU_WECHAT_MINI:
          return await this.checkUser(data, exp, operatorId);
        case CLIENTS.GUGU_ADMIN:
        default:
          return await this.checkAdminUser(data, exp);
      }
    } catch(e) {
      ctx.response.body = {
        error: "Fail to auth request due to exception: " + e,
        code: errorCode.GLOBAL_AUTH_FAILED_TO_AUTH_EXPIRED_TOKEN
      };
      return;
    }
  }

  async checkUser(data, exp, operatorId) {

    const {ctx} = this;

    const {clientType, openId} = data;

    if(exp * 1000 < Date.now()) {
      ctx.response.body = {
        error: "Fail to auth request due to expired token: " + ctx.request.body.operationName,
        code: errorCode.GLOBAL_AUTH_FAILED_TO_AUTH_EXPIRED_TOKEN
      };
      ctx.cookies.set('accessToken');
      return;
    }

    const user = await ctx.model['User'].findOne(
      {
        "credential": { 
          $elemMatch: { clientType, openId } 
        }
      }
    );

    if(!user || !user._id || (typeof(operatorId) === 'string' && user._id.toString() !== operatorId)) {
      ctx.response.body = {
        error: "Fail to auth request: " + ctx.request.body.operationName,
        code: errorCode.GLOBAL_AUTH_FAILED_TO_AUTH
      };
      ctx.cookies.set('accessToken');
      return;
    }

    return user;
  }

  async checkAdminUser(data, exp) {

    const {ctx} = this;

    const {email} = data;

    if(exp * 1000 < Date.now()) {
      ctx.response.body = {
        error: "Fail to auth request due to expired token: " + ctx.request.body.operationName,
        code: errorCode.GLOBAL_AUTH_FAILED_TO_AUTH_ADMIN_EXPIRED_TOKEN
      };
      ctx.cookies.set('accessToken');
      return;
    }

    const user = await ctx.model['AdminUser'].findOne(
      {
        email
      }
    );

    if(!user || !user._id) {
      ctx.response.body = {
        error: "Fail to auth request: " + ctx.request.body.operationName,
        code: errorCode.GLOBAL_AUTH_FAILED_TO_AUTH_ADMIN
      };
      ctx.cookies.set('accessToken');
      return;
    }

    return user;
  }

  async getAccessToken() {

    const {ctx} = this;

    const accessToken = ctx.cookies.get('accessToken', { signed: false, encrypt: true });
    if(!accessToken) {
      ctx.response.body = {
        error: "Fail to auth request for missing access token: " + ctx.request.body.operationName,
        code: errorCode.GLOBAL_AUTH_FAILED_TO_AUTH
      };
      return;
    }

    return await ctx.service.token.verifyJwt(accessToken);

  }

}

module.exports = AuthService;
