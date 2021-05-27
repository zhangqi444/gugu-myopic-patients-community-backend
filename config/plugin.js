'use strict';

// had enabled by egg
// exports.static = true;

exports.mongoose = {
  enable: true,
  package: 'egg-mongoose',
};

exports.cors = {
  enable: true,
  package: 'egg-cors',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.graphql = {
  enable: true,
  package: 'egg-graphql',
};

exports.proxyworker = {
  enable: true,
  package: 'egg-development-proxyworker',
};

exports.validate = {
  package: 'egg-validate',
};
