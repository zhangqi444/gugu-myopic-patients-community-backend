'use strict';

const { CLIENTS } = require('../constant/constants');
const { ACTION_ACTOR_TYPE } = require('../constant/types');

module.exports = options => {

  return async function check(ctx, next) {
    let operatorId = undefined;

    // 需要授权，且依赖于auth token才可以访问的API
    switch (ctx.request.body.operationName) {
      case 'addThumb':
        operatorId = ctx.request.body.variables.thumbInput.actor;
        var result = await ctx.service.auth.check(operatorId);
        if(!result) return;
        if(!operatorId) {
          ctx.request.body.variables.thumbInput.actorType = ACTION_ACTOR_TYPE.USER;
          ctx.request.body.variables.thumbInput.actor = result._id;
        }
        return next();
      case 'addVisit':
        operatorId = ctx.request.body.variables.visitInput.actor;
        var result = await ctx.service.auth.check(operatorId);
        if(!result) return;
        if(!operatorId) {
          ctx.request.body.variables.visitInput.actorType = ACTION_ACTOR_TYPE.USER;
          ctx.request.body.variables.visitInput.actor = result._id;
        }
        return next();
      case 'addCollect':
        operatorId = ctx.request.body.variables.collectInput.actor;
        var result = await ctx.service.auth.check(operatorId);
        if(!result) return;
        if(!operatorId) {
          ctx.request.body.variables.collectInput.actorType = ACTION_ACTOR_TYPE.USER;
          ctx.request.body.variables.collectInput.actor = result._id;
        }
        return next();
      case 'addComment':     
        // TODO: 添加支持医生和官方账号回复
        operatorId = ctx.request.body.variables.commentInput.user;
        var result = await ctx.service.auth.check(operatorId);
        if(!result) return;
        if(!operatorId) {
          ctx.request.body.variables.commentInput.user = result._id;
          ctx.request.body.variables.commentInput.authorType = ACTION_ACTOR_TYPE.USER;
        }
        return next();
      case 'addPostComment':     
        // TODO: 添加支持医生和官方账号回复
        operatorId = ctx.request.body.variables.postCommentInput.user;
        var result = await ctx.service.auth.check(operatorId);
        if(!result) return;
        if(!operatorId) {
          ctx.request.body.variables.postCommentInput.user = result._id;
          ctx.request.body.variables.postCommentInput.authorType = ACTION_ACTOR_TYPE.USER;
        }
        return next();
      case 'addPost':   
      case 'updatePost':  
        // TODO: 添加支持医生和官方账号回复
        operatorId = ctx.request.body.variables.postInput.user;
        var result = await ctx.service.auth.check(operatorId);
        if(!result) return;
        if(!operatorId) {
          ctx.request.body.variables.postInput.user = result._id;
          ctx.request.body.variables.postInput.authorType = ACTION_ACTOR_TYPE.USER;
        }
        return next();
      case 'addExamRecordResult':
      case 'updateExamRecordResult':
        operatorId = ctx.request.body.variables.examRecordResultInput.user;
        var result = await ctx.service.auth.check(operatorId);
        if(!result) return;
        if(!operatorId) {
          ctx.request.body.variables.examRecordResultInput.user = result._id;
          ctx.request.body.variables.examRecordResultInput.authorType = ACTION_ACTOR_TYPE.USER;
        }
        return next();
      case 'addSurveyResult':
      case 'updateSurveyResult':
        operatorId = ctx.request.body.variables.surveyResultInput.user;
        var result = await ctx.service.auth.check(operatorId);
        if(!result) return;
        if(!operatorId) {
          ctx.request.body.variables.surveyResultInput.user = result._id;
          ctx.request.body.variables.surveyResultInput.authorType = ACTION_ACTOR_TYPE.USER;
        }
        return next();

      case 'updateNotification':
        operatorId = ctx.request.body.variables.notificationInput.user;
        var result = await ctx.service.auth.check(operatorId);
        if(!result) return;
        if(!operatorId) {
          ctx.request.body.variables.notificationInput.user = result._id;
        }
        return next();
      
      case 'viewNotificationsBySelf':
      case 'examRecordsBySelf':
      case 'surveyResultsBySelf':
      case 'collectsBySelf':
      case 'commentsBySelf':
      case 'commentsByArticle':
      case 'postsByCircles':
      case 'postsBySelf':
      case 'postCommentsBySelf':
      case 'postRich':
      case 'articleRich':
        operatorId = ctx.request.body.variables.userId;
        var result = await ctx.service.auth.check(operatorId);
        if(!result) return;
        if(!operatorId) {
          ctx.request.body.variables.userId = result._id;
        }
        return next();

      case 'userRich':
      case 'onboardSelf':
        operatorId = ctx.request.body.variables.id;
        var result = await ctx.service.auth.check(operatorId);
        if(!result) return;
        return next();

      // 仅用于管理及测试的API
      case 'addTag':
      case 'updateTag':
      case 'deleteTag':
      case 'addOrganization':
      case 'updateOrganization':
      case 'deleteOrganization':
      case 'surveyResultsAdmin':
      case 'surveyResultAdmin':
      case 'addSurveyAdmin':
      case 'updateSurveyAdmin':
      case 'deleteSurveyAdmin':
      case 'addDoctor':
      case 'updateDoctor':
      case 'deleteDoctor':
      case 'addExpertAdmin':
      case 'updateExpertAdmin':
      case 'deleteExpertAdmin':
      case 'addTopictAdmin':
      case 'updateTopicAdmin':
      case 'deleteTopicAdmin':
      case 'addCircleAdmin':
      case 'updateCircleAdmin':
      case 'deleteCircleAdmin':
      case 'addArticle':
      case 'updateArticle':
      case 'deleteArticle':
      case 'examRecordResultAdmin':
      case 'examRecordResultsAdmin':
      case 'addExamRecordAdmin':
      case 'updateExamRecordAdmin':
      case 'deleteExamRecordAdmin':
      case 'adminUsers':
      case 'adminUser':
      case 'usersAdmin':
      case 'userAdmin':
      case 'notificationsAdmin':
      case 'notificationAdmin':
      case 'addNotificationAdmin':
      case 'deleteNotificationAdmin':
        const {data, exp} = await ctx.service.auth.getAccessToken();
        const { clientType } = data;
        if (clientType === CLIENTS.GUGU_ADMIN) {
          var result = await ctx.service.auth.checkAdminUser(data, exp);
          if(result) return next();
        }
        return;

      // 不需要auth check的API
      case 'adminUserLogout':
      case 'adminUserLogin':
      case 'adminUserByToken':
      case 'userLogin':
        return next();
    
      default:
        // 不需要授权可以访问的API，特殊，如graphqli
        if(!ctx.request.body.operationName) return next();
        // 需要授权才可以访问的API
        var result = await ctx.service.auth.check();
        if(result) return next();
        return;
    }
    
  };
};
