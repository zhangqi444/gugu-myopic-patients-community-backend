'use strict';

const Service = require('egg').Service;
const jwt = require('jsonwebtoken');
const util = require('util');

class TokenService extends Service {
  signJwt(data, exp) {
    const { config } = this;
    const sign = util.promisify(jwt.sign);

    return sign({
      data,
      exp: exp || Math.floor(Date.now() / 1000) + config.jwtOpts.expireTime,
    }, config.jwtOpts.secretKey);
  }

  verifyJwt(accessToken) {
    const verify = util.promisify(jwt.verify);
    const { config } = this;

    return verify(accessToken, config.jwtOpts.secretKey);
  }
}

module.exports = TokenService;
