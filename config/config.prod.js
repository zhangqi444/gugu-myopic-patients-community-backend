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

  // mongoose配置
  config.mongoose = {
    url: process.env.MONGODB_URL,
  };

  config.cluster = {
    listen: {
      port: 7777,
    }
  }

  config.aliyun = {
    region: process.env.ALIYUN_REGION || 'oss-cn-beijing',
    accessKeyId: process.env.ALIYUN_ACCESS_KEY_ID,
    accessKeySecret: process.env.ALIYUN_ACCESS_KEY_SECRET,
    bucket: process.env.ALIYUN_BUCKET || 'yuanu-image',
    userBucket: process.env.ALIYUN_USER_BUCKET || 'yuanu-user-image',
  }

  config.cors = {
    origin: 'https://kmic3bhbxl.gugueye.com',
    credentials: true,
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  }

  // // 阿里nodejs监测平台
  // config.alinode = {
  //   enable: true,
  //   appid: '81581',
  //   secret: '1307cc29f6785e1c28efac0f0d7ad8a3a4442867',
  // };

  return {
    ...config,
  };
};
