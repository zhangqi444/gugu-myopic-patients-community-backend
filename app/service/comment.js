'use strict';

const Service = require('egg').Service;
const { SECURITY_CHECK_STATUS } = require('../constant/common');
const { MODEL_NAMES } = require('../constant/models');
const { ACTION_ACTOR_TYPE, ACTION_TARGET_TYPE } = require('../constant/types');

class CommentService extends Service {


  _getCommentsQuery(userId, query, condition) {
    return {
      $and: [
        {
          isDeleted: { $ne: true }, // default condition
          isBlocked: { $ne: true }, // default condition
          ...this.ctx.service.util.convertCondition(condition),
          ...query,
        },
        {
          $or: [
            { securityCheckStatus: SECURITY_CHECK_STATUS.PASSED },
            { 
              securityCheckStatus: SECURITY_CHECK_STATUS.CHECKING,
              user: userId
            }
          ]
        }
      ]
    };
  }

  async getComments(model, query, userId, option, condition) {

    let comments = await this.ctx.model[model].find(this._getCommentsQuery(userId, query, condition), null, option)
      .populate('officialUser').populate('doctor').populate('user').populate('expert').populate('comment').populate('nestedComment').populate('article').exec(); // TODO: 优化只populate必须的列
    
    const targetType = model === MODEL_NAMES.COMMENT ? ACTION_TARGET_TYPE.COMMENT : ACTION_TARGET_TYPE.POST_COMMENT;

    if(userId) {
      var getSelf = async (r) => { // sample async action
        // TODO: 这个请求需要优化，可以通过一个query即可实现。
        const actionQuery = { actor: userId, actorType: ACTION_ACTOR_TYPE.USER, target: r._id, targetType };
        const thumb = await this.ctx.model[MODEL_NAMES.THUMB].findOne(actionQuery, '_id value',  { _id: -1 });
        return { ...r._doc, self: { thumb } };
      };
      comments = Promise.all(comments.map(getSelf));
    }

    // if(query.isNestedComment) {

    // }

    // var getNestedComments = async (r) => {
    //   await this.ctx.model[model].find(getQuery(true), null, option)
    //     .populate('officialUser').populate('doctor').populate('user').populate('expert').exec(); // TODO: 优化只populate必须的列
    
    // };

    // comments = [...comments, ...Promise.all(comments.map(getNestedComments))];

    return comments;
  }

  async add(model, parentModel, parentId, commentInput, errorCode) {
    try {
      const result = await this.ctx.model[model].create(
        [ { ...commentInput, securityCheckStatus: SECURITY_CHECK_STATUS.CHECKING } ]
      );
      
      let comment = result && result[0];

      comment = await comment.populate('officialUser').populate('doctor').populate('user').populate('expert').populate('comment').populate('nestedComment').populate('article').execPopulate();

      comment && this._checkSecurity(model, comment, parentModel, parentId,);
      return comment;
    } catch(e) {
      console.error(e);
      this.ctx.response.body = {
        error: "Fail to add comment: " + e,
        code: errorCode
      };
    }
  }

  _checkSecurity(model, commentToCheck, parentModel, parentId,) {
    Promise.resolve(this.ctx.service.wechat.msgSecCheck(commentToCheck.content)).then(async (response) => {
      const {errcode, errmsg} = response;

      const securityCheckStatus = errcode === 0 ? SECURITY_CHECK_STATUS.PASSED : SECURITY_CHECK_STATUS.FAILED;
      
      const updatedComment = await this.ctx.model[model].findOneAndUpdate(
        { _id: commentToCheck._id }, 
        { securityCheckStatus }
      );

      if (errcode !== 0 || updatedComment.isDeleted) return;
      
      await this.ctx.model[parentModel].findOneAndUpdate(
        { _id: parentId },
        { $inc: {'commentCount': 1} },
        { new: true }
      );

      this.ctx.service.notification.addComment(commentToCheck, model);

    }).catch(async (e) => {
      console.log(e)
      await this.ctx.model[model].findByIdAndUpdate(
        commentToCheck._id, 
        { securityCheckStatus: SECURITY_CHECK_STATUS.FAILED }
      );
    });
  }

  async delete(model, id, parentModel, errorCode) {
    try {
      const result = await this.ctx.model[model].findOneAndUpdate(
        { _id: id, isDeleted: false }, { isDeleted: true}, { new: true }
      );

      if(result.securityCheckStatus === SECURITY_CHECK_STATUS.PASSED) {
        await this.ctx.model[parentModel].findByIdAndUpdate(
          result._id,
          { $inc: {'commentCount': -1} },
          { new: true }
        );
      }

      return result;
    } catch(e) {
      console.error(e);
      this.ctx.response.body = {
        error: "Fail to delete comment: " + e,
        code: errorCode
      };
    }
  }
}

module.exports = CommentService;
