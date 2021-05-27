'use strict';

const BasicConnector = require('../common/basicConnector');
const { CLIENTS } = require("../../constant/constants");
const errorCode = require("../../error/errorCode");
const { ONBOARDING_STATUS } = require("../../constant/user");
const { MODEL_NAMES } = require("../../constant/models");
const { NOTIFICATION_STATUS } = require("../../constant/notification");

const MODEL_NAME = 'User';
class UserConnector extends BasicConnector {

  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }

  async userRich(id) {
    let user = this.ctx.model[this.model].findOne({ _id: id }).exec();

    const basicQuery = { user: id, isDeleted: false, isBlocked: false };

    const getCount = (model, query) => {
      return this.ctx.model[model].countDocuments(query).exec();
    }

    let postCount = getCount(MODEL_NAMES.POST, basicQuery);
    let commentCount = getCount(MODEL_NAMES.COMMENT, basicQuery);
    let postCommentCount = getCount(MODEL_NAMES.POST_COMMENT, basicQuery);
    let collectCount = getCount(MODEL_NAMES.COLLECT, { actor: id, value: true });
    let notificationCount = getCount(MODEL_NAMES.NOTIFICATION, { ...basicQuery, status: NOTIFICATION_STATUS.INIT });
    let surveyResultCount = getCount(MODEL_NAMES.SURVEY_RESULT, basicQuery);
    let examRecordResultCount = getCount(MODEL_NAMES.EXAM_RECORD_RESULT, basicQuery);

    await Promise.all([user, postCount, commentCount, postCommentCount, collectCount, notificationCount, surveyResultCount, examRecordResultCount]);

    // 将promise转化成值，mongoose配合promise.all所需的特殊操作
    user = await user;
    postCount = await postCount;
    commentCount = await commentCount;
    postCommentCount = await postCommentCount;
    collectCount = await collectCount;
    notificationCount = await notificationCount;
    surveyResultCount = await surveyResultCount;
    examRecordResultCount = await examRecordResultCount;

    if(user) {
      return { ...user._doc, postCount, commentCount, postCommentCount, collectCount, notificationCount, surveyResultCount, examRecordResultCount };
    }
  }

  async userLogin(userLoginPayload) {
    const clientType = await this.ctx.service.util.getClientType();
    switch (clientType) {
      case CLIENTS.GUGU_WECHAT_MINI:
        return await this.userWechatMiniLogin(clientType, userLoginPayload);
    
      default:
        return;
    }
  }

  async userWechatMiniLogin(clientType, userLoginPayload) {

    try {

      const { jscode, grantType } = userLoginPayload;
      
      let result = await this.ctx.service.wechat.jsCode2Session(jscode, grantType);

      if (!result) return;
      result = JSON.parse(result);
      const sessionKey = result['session_key'];
      const openId = result['openid'];
      // const unionId = result['unionid'];
      if(!sessionKey || !openId) return;

      const user = await this.ctx.model[this.model].findOneAndUpdate(
        {
          "credential": { 
            $elemMatch: { clientType, openId } 
          }
        }, 
        {
          loginedAt: Date.now(),
          credential: { sessionKey, clientType, openId }
          // unionId
        },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      const accessToken = await this.ctx.service.token.signJwt({ openId, sessionKey, clientType });

      this.ctx.cookies.set('accessToken', accessToken, { signed: false, encrypt: true });

      return user;
    } catch(e) {
      console.error(e);
      this.ctx.response.body = {
        error: "Fail to login WeChat mini program user: " + e,
        code: errorCode.USER_FAILED_TO_USER_WECHAT_MINI_LOGIN
      };
    }
  }

  async onboardSelf(id, input) {
    const result = await this.ctx.model[this.model].findByIdAndUpdate(
      { _id: id },
      { ...input, onboardingStatus: ONBOARDING_STATUS.ONBOARDED, loginedAt: Date.now(), updatedAt: Date.now(), },
      { upsert: false, new: true, setDefaultsOnInsert: true }
    );
    return result;
  }

  // async userByToken(token) {
  //   const user = await this.ctx.model[this.model].find(
  //     {
  //       isDeleted: false,
  //       isBlocked: false,
  //       token,
  //     },
  //   );
  //   if (!user) throw new Error("User not found")
  //   return user
  // }
}

module.exports = UserConnector;
