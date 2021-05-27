'use strict';

module.exports = (app) => {
  app.get('/', 'home.index');
  app.resources('users', '/api/users', app.controller.user);
};
