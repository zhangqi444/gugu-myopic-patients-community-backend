/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  config.jwtOpts = {
    secretKey: process.env.JWT_SECRET_KEY,
    expireTime: 7 * 24 * 60 * 60,
  };

  config.cors = {
    origin: '*',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  },

  // mongoose配置
  config.mongoose = {
    url: process.env.MONGODB_URL
  };
  
  return {
    ...config,
  };
};
