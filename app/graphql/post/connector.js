'use strict';

const BasicConnector = require('../common/basicConnector');
const { MODEL_NAMES } = require('../../constant/models');
const { ACTION_ACTOR_TYPE, ACTION_TARGET_TYPE } = require('../../constant/types');
const { SECURITY_CHECK_STATUS } = require('../../constant/common');
const errorCode = require('../../error/errorCode');
const mongoose = require('mongoose');

const MODEL_NAME = MODEL_NAMES.POST;

class PostConnector extends BasicConnector {
  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }

  async fetchRichById(id, userId, option, condition) {

    try {
      let post = await this._fetchBy({ '_id': id }, userId, option, condition);
      return post && post[0];
    } catch(e) {
      console.error(e);
      this.ctx.response.body = {
        error: "Fail to fetch post full: " + e,
        code: errorCode.POST_FAILED_TO_FETCH_RICH_BY_ID
      };
      return;
    }
  }

  async fetchBySelf(userId, option, condition) {
    return this._fetchBy({ user: userId }, userId, option, condition);
  }

  async fetchByCircles(circles, userId, option, condition) {
    return this._fetchBy({ 'circle': { $all: circles.map(c => mongoose.Types.ObjectId(c)) } }, userId, option, condition);
  }

  async _fetchBy(query, userId, option, condition) {
    let result = await this.ctx.model[this.model].find(
      {
        $and: [
          {
            isDeleted: { $ne: true }, // default condition
            isBlocked: { $ne: true }, // default condition
            ...this._convertCondition(condition),
            ...query
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
      },
      null,
      option
    ).populate('officialUser').populate('doctor').populate('user').populate('expert').exec();

    if(userId && result) {
      var getSelf = async (r) => { // sample async action
        const actionQuery = { actor: userId, actorType: ACTION_ACTOR_TYPE.USER, target: r._id, targetType: ACTION_TARGET_TYPE.POST };
        const thumb = this.ctx.model[MODEL_NAMES.THUMB].findOne(actionQuery, '_id value',  { _id: -1 });
        const collect = this.ctx.model[MODEL_NAMES.COLLECT].findOne(actionQuery, '_id value',  { _id: -1 });
        return { ...r._doc, self: { thumb, collect } };
      };
      result = await Promise.all(result.map(getSelf));
    }

    return result; 
  }

  async fetchBySearch(query, option, condition) {

    let promise = new Promise((resolve, reject) => {
      this.ctx.model[this.model].search(
        {
          query_string: { query }
        },
        {
          from: option.skip,
          size: option.limit,
          hydrate: true,
          hydrateOptions: {
            populate: [{path: 'officialUser'}, {path: 'doctor'}, {path: 'user'}, {path: 'expert'}],
            // filter: function(doc) {
            //   var filterd = true;
            //   console.log(condition)
            //   // Object.keys(condition).map(k => {
            //   //   filterd && condition && doc && doc[k] === condition[k];
            //   // });
            //   return filtered;
            // }
          }, 
        },
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results.hits.hits);
          }
        }
      );
    });
    
    return promise;
  }

  async add(postInput) {
    try {
      const result = await this.ctx.model[MODEL_NAME].create(
        [ { ...postInput, securityCheckStatus: SECURITY_CHECK_STATUS.CHECKING } ]
      );
      
      let post = result && result[0];

      post = await post.populate('officialUser').populate('doctor').populate('user').populate('expert').execPopulate();

      post && this._checkSecurity(post);
      return post;
    } catch(e) {
      console.error(e);
      this.ctx.response.body = {
        error: "Fail to add post: " + e,
        code: errorCode
      };
    }
  }

  async update(id, postInput) {
    try {

      const { circle, topics, title, content } = postInput;

      const post = await this.ctx.model[MODEL_NAME].findOneAndUpdate(
        { _id: id, isDeleted: false }, 
        { updatedAt: Date.now(), circle, topics, title, content, securityCheckStatus: SECURITY_CHECK_STATUS.CHECKING }, 
        { new: true }
      ).populate('officialUser').populate('doctor').populate('user').populate('expert').exec();

      post && this._checkSecurity(post);
      return post;
    } catch(e) {
      console.error(e);
      this.ctx.response.body = {
        error: "Fail to add post: " + e,
        code: errorCode
      };
    }
  }

  _checkSecurity(postToCheck) {
    Promise.resolve(this.ctx.service.wechat.msgSecCheck(postToCheck.content + ' ' + postToCheck.title)).then(async (response) => {
      const {errcode, errmsg} = response;

      const securityCheckStatus = errcode === 0 ? SECURITY_CHECK_STATUS.PASSED : SECURITY_CHECK_STATUS.FAILED;
      
      const updatedPost = await this.ctx.model[MODEL_NAME].findOneAndUpdate(
        { _id: postToCheck._id }, 
        { securityCheckStatus }
      );

      if (errcode !== 0 || updatedPost.isDeleted) return;

    }).catch(async (e) => {
      console.log(e)
      await this.ctx.model[MODEL_NAME].findByIdAndUpdate(
        postToCheck._id, 
        { securityCheckStatus: SECURITY_CHECK_STATUS.FAILED }
      );
    });
  }

  async delete(id, postInput) {
    try {
      const result = await this.ctx.model[MODEL_NAME].findOneAndUpdate(
        { _id: id, isDeleted: false }, { isDeleted: true}, { new: true }
      );
      return result;
    } catch(e) {
      console.error(e);
      this.ctx.response.body = {
        error: "Fail to delete post: " + e,
        code: errorCode
      };
    }
  }
}

module.exports = PostConnector;

