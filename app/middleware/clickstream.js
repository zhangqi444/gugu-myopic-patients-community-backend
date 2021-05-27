'use strict';

var parser = require('ua-parser-js');

module.exports = options => {

  return function log(ctx, next) {

    const ua = parser(ctx.get('user-agent'));

    let input = {};
    input.client = ctx.service.util.getClientType();
    input.serviceName = ctx.request.body.operationName ? ctx.request.body.operationName : 'UNKNOWN';
    input.methodName = `${ua.os.name}/${ua.os.version}`;

    switch (ctx.request.body.operationName) {
      case 'article':
      case 'articleRich':
      case 'doctor':
        input.instance = ctx.request.body.variables.id;
        break;
      case 'articlesByAnyTags':
      case 'articlesByAnyTags':
        input.instance = ctx.request.body.variables.tags;
        break;
      case 'articlesBySearch':
        input.instance = ctx.request.body.variables.query;
        break;

      default:
        break;
    }

    input.value = 1;

    if (process.env.EGG_SERVER_ENV === 'prod') {
      ctx.service.clickstream.add(input);
    }

    return next();
    
  };
};
