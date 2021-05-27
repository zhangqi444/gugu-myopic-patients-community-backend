'use strict';

const BasicConnector = require('../common/basicConnector');
const { MODEL_NAMES } = require('../../constant/models');
const errorCode = require('../../error/errorCode');

const MODEL_NAME = MODEL_NAMES.COMMENT;
class CommentConnector extends BasicConnector {

  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }

  async fetchCommentsByArticle(id, commentId, userId, isNestedComment, option, condition) {
    const query = { article: id };
    if(commentId !== null && commentId !== undefined) query.comment = commentId;
    // TOOD: 目前该请求返回所有的评论和评论的回复，前端不进行区别显示
    return await this.ctx.service.comment.getComments(MODEL_NAME, query, userId, option, condition);
  }

  async fetchCommentsBySelf(userId, option, condition) {
    const query = { user: userId };
    return await this.ctx.service.comment.getComments(MODEL_NAME, query, userId, option, condition);
  }

  async add(commentInput) {
    return await this.ctx.service.comment.add(
      MODEL_NAME, 
      MODEL_NAMES.ARTICLE, 
      commentInput.article, 
      commentInput,
      errorCode.COMMENT_FAILED_TO_ADD_COMMENT
    );
  }

  async addNestedComment(commentInput) {
    return await this.ctx.service.comment.add(
      MODEL_NAME, 
      MODEL_NAMES.ARTICLE, 
      commentInput.article, 
      { ...commentInput, isNestedComment: true }, 
      errorCode.COMMENT_FAILED_TO_ADD_NESTED_COMMENT
    );
  }

  async delete(id, input) {
    return await this.ctx.service.comment.delete(
      MODEL_NAME, 
      id, 
      MODEL_NAMES.ARTICLE, 
      errorCode.COMMENT_FAILED_TO_DELETE_COMMENT
    );
  }
}

module.exports = CommentConnector;

