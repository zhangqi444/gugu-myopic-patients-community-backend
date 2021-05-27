'use strict';

module.exports = {
  // global error: 10xxxx
  // global auth error: 1000xx
  GLOBAL_AUTH_FAILED_TO_AUTH: 100000,
  GLOBAL_AUTH_FAILED_TO_AUTH_EXPIRED_TOKEN: 100001,
  // user error: 20xxxx
  USER_FAILED_TO_USER_WECHAT_MINI_LOGIN: 200001,
  // article error: 30xxxx
  ARTICLE_FAILED_TO_FETCH_RICH_BY_ID: 300001,
  // comment error: 40xxxx
  COMMENT_FAILED_TO_ADD_COMMENT: 400001,
  COMMENT_FAILED_TO_DELETE_COMMENT: 400002,
  COMMENT_FAILED_TO_ADD_NESTED_COMMENT: 400003,
  // post error: 50xxxx
  POST_FAILED_TO_FETCH_RICH_BY_ID: 500001,
  // post comment error: 60xxxx
  POST_COMMENT_FAILED_TO_ADD_POST_COMMENT: 600001,
  POST_COMMENT_FAILED_TO_DELETE_POST_COMMENT: 600002,
  POST_COMMENT_FAILED_TO_ADD_NESTED_POST_COMMENT: 600003,
  // doctor error: 40xxxx
  // officialuser error: 50xxxx
  // organizatoin error: 60xxxx
  // actoin error: 70xxxx
  // expert error: 70xxxx
  // adminuser: 90xxxx
  GLOBAL_AUTH_FAILED_TO_AUTH_ADMIN: 900000,
  GLOBAL_AUTH_FAILED_TO_AUTH_ADMINEXPIRED_TOKEN: 900001,
};
