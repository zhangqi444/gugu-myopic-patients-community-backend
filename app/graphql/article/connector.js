'use strict';

const BasicConnector = require('../common/basicConnector');
const { MODEL_NAMES } = require('../../constant/models');
const { ACTION_ACTOR_TYPE, ACTION_TARGET_TYPE } = require('../../constant/types');
const { SECURITY_CHECK_STATUS } = require('../../constant/common');
const errorCode = require('../../error/errorCode');

const MODEL_NAME = MODEL_NAMES.ARTICLE;

class ArticleConnector extends BasicConnector {
  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }

  /**
   * Get an article with the full informatoin, such as the current user's interaction information, comments, and so on. 
   * @param  {string} id the article id
   */
  async fetchRichById(id, userId, option, condition) {

    try {
      let article = this.fetchById(id);

      if(!article) return;

      const query = {
        $and: [
          {
            isDeleted: { $ne: true }, // default condition
            isBlocked: { $ne: true }, // default condition
            article: id,
            isNestedComment: false // TODO: 暂时只返回评论，不返回评论的回复
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
      let commentCount = this.ctx.model[MODEL_NAMES.COMMENT].countDocuments(query).exec();
      let comments = this.ctx.model[MODEL_NAMES.COMMENT].find(query, null, { limit: 2 })
        .populate('officialUser').populate('doctor').populate('expert').exec(); // TODO: 优化只populate必须的列

      await Promise.all([comments, commentCount, article]);
      comments = await comments; // 将promise转化成值，mongoose配合promise.all所需的特殊操作
      commentCount = await commentCount; // 将promise转化成值，mongoose配合promise.all所需的特殊操作
      article = await article; // 将promise转化成值，mongoose配合promise.all所需的特殊操作

      if(userId) {
        const actionQuery = { actor: userId, actorType: ACTION_ACTOR_TYPE.USER, target: article._id, targetType: ACTION_TARGET_TYPE.ARTICLE };
        const visit = this.ctx.model[MODEL_NAMES.VISIT].findOne(actionQuery, '_id value',  { _id: -1 });
        const thumb = this.ctx.model[MODEL_NAMES.THUMB].findOne(actionQuery, '_id value',  { _id: -1 });
        const collect = this.ctx.model[MODEL_NAMES.COLLECT].findOne(actionQuery, '_id value',  { _id: -1 });

        var getSelf = async (r) => { // sample async action
          const actionQuery = { actor: userId, actorType: ACTION_ACTOR_TYPE.USER, target: r._id, targetType: ACTION_TARGET_TYPE.COMMENT };
          const thumb = await this.ctx.model[MODEL_NAMES.THUMB].findOne(actionQuery, '_id value',  { _id: -1 });
          return { ...r._doc, self: { thumb } };
        };
        comments = comments && Promise.all(comments.map(getSelf));
        await Promise.all([visit, thumb, collect, comments]);
        article.self = { visit, thumb, collect };

      }
      article.comments = comments;
      article.commentCount = commentCount;

      return article;

    } catch(e) {
      console.error(e);
      this.ctx.response.body = {
        error: "Fail to fetch article full: " + e,
        code: errorCode.ARTICLE_FAILED_TO_FETCH_RICH_BY_ID
      };
      return;
    }
  }

  async fetchByTags(tags, option, condition) {
    const result = await this.ctx.model[this.model].find(
      {
        isDeleted: { $ne: true }, // default condition
        isBlocked: { $ne: true }, // default condition
        ...this._convertCondition(condition),
        'tags.name': {
          $all: tags
        }
      },
      null,
      option
    ).populate('officialUser').populate('doctor').populate('expert').exec();
    return result;
  }

  async fetchByAnyTags(tags, option, condition) {
    const result = await this.ctx.model[this.model].find(
      {
        isDeleted: { $ne: true }, // default condition
        isBlocked: { $ne: true }, // default condition
        ...this._convertCondition(condition),
        'tags.name': {
          $in: tags
        }
      },
      null,
      option
    ).populate('officialUser').populate('doctor').populate('expert').exec();
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
            populate: [{path: 'officialUser'}, {path: 'doctor'}, {path: 'expert'}],
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
}

module.exports = ArticleConnector;

