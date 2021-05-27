'use strict';

const BasicConnector = require('../common/basicConnector');
const { MODEL_NAMES } = require('../../constant/models');
const errorCode = require('../../error/errorCode');

const MODEL_NAME = MODEL_NAMES.POST_COMMENT;

class PostCommentConnector extends BasicConnector {

  constructor(ctx) {
    super(ctx, MODEL_NAME);
  }

  async fetchPostCommentsByPost(id, postCommentId, userId, isNestedPostComment, option, condition) {
    let query = { post: id, postComment: postCommentId, isNestedPostComment };
    return await this.ctx.service.comment.getComments(MODEL_NAME, query, userId, option, condition);
  }

  async fetchPostCommentsBySelf(userId, option, condition) {
    let query = { user: userId };
    return await this.ctx.service.comment.getComments(MODEL_NAME, query, userId, option, condition);
  }

  async add(commentInput) {
    return await this.ctx.service.comment.add(
      MODEL_NAME, 
      MODEL_NAMES.POST, 
      commentInput.post, 
      commentInput, 
      errorCode.POST_COMMENT_FAILED_TO_ADD_POST_COMMENT
    );
  }

  async addNestedComment(commentInput) {
    return await this.ctx.service.comment.add(
      MODEL_NAME, 
      MODEL_NAMES.POST, 
      commentInput.post, 
      { ...commentInput, isNestedComment: true }, 
      errorCode.POST_COMMENT_FAILED_TO_ADD_NESTED_POST_COMMENT
    );
  }

  async delete(id, input) {
    return await this.ctx.service.comment.delete(
      MODEL_NAME, 
      id, 
      MODEL_NAMES.POST,
      { ...commentInput, isNestedComment: true }, 
      errorCode.POST_COMMENT_FAILED_TO_DELETE_POST_COMMENT
    );
  }
}

module.exports = PostCommentConnector;

