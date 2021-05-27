
'use strict';

const Service = require('egg').Service;
const request = require('request-promise');

const WECHAT_API_HOST = 'https://api.weixin.qq.com';

const WECHAT_API_SNS = `${WECHAT_API_HOST}/sns`;
const WECHAT_API_SNS_JSCODE_2_SESSION = `${WECHAT_API_SNS}/jscode2session`;

const WECHAT_API_CGI_BIN = `${WECHAT_API_HOST}/cgi-bin`;
const WECHAT_API_CGI_BIN_GET_ACCESS_TOKEN = `${WECHAT_API_CGI_BIN}/token`;

const WECHAT_API_WXA = `${WECHAT_API_HOST}/wxa`;
const WECHAT_API_WXA_MSG_SEC_CHECK = `${WECHAT_API_WXA}/msg_sec_check`;

class WechatService extends Service {

  constructor(ctx) {
    super(ctx);
    this.accessToken = null;
    const { clients } = this.ctx.app.config;
    this.appId = clients.WECHAT_MINI.APP_ID;
    this.appSecret = clients.WECHAT_MINI.APP_SECRET;
  }
  
  async jsCode2Session(jsCode, grantType) {
    const url = `${WECHAT_API_SNS_JSCODE_2_SESSION}?appid=${this.appId}&secret=${this.appSecret}&js_code=${jsCode}&grant_type=${grantType}`;
    return await request(url);
  }

  async _getAccessToken() {
    if(!this.accessToken || !this.accessToken.token || this.accessToken.expiredAt < Date.now()) {
      const url = `${WECHAT_API_CGI_BIN_GET_ACCESS_TOKEN}?appid=${this.appId}&secret=${this.appSecret}&grant_type=client_credential`;
      let accessToken = await request(url);
      accessToken = JSON.parse(accessToken);
      if(accessToken && accessToken.access_token) {
        this.accessToken = {
          token: accessToken.access_token,
          expiredAt: accessToken.expires_in + Date.now()
        }
      }
    }
    return this.accessToken;
  }

  async msgSecCheck(content) {
    const accessToken = await this._getAccessToken();
    const url = `${WECHAT_API_WXA_MSG_SEC_CHECK}?access_token=${accessToken.token}`;
    var options = {
      method: 'POST',
      url,
      body: {
        content,
      },
      json: true // Automatically stringifies the body to JSON
    };
    return await request(options);
  }
}

module.exports = WechatService;
