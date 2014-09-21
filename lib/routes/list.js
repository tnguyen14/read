'use strict';

var Router = require('../router');
var List = require('../controllers/list');

module.exports = function (server) {
  server.get('/', function (req, res, next) {
    Router.route(req, res, next, List.showAll);
  });
}
