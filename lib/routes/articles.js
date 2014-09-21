'use strict';

var Router = require('../router');
var ObjectId = require('mongod').ObjectId;
var Articles = require('../controllers/articles');

module.exports = function (server) {
  server.get('/:list/articles', function (req, res, next) {
    Router.route(req, res, next, Articles.showAll);
  });

  server.post('/:list/articles', function (req, res, next) {
    Router.route(req, res, next, Articles.newArticle);
  });
};
