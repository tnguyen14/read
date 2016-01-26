'use strict';

var Router = require('../router');
var List = require('../controllers/list');

module.exports = function (server) {
	server.get('/', function (req, res, next) {
		Router.route(req, res, next, List.showAll);
	});

	server.post('/', function (req, res, next) {
		Router.route(req, res, next, List.newList);
	});

	server.get('/:list', function (req, res, next) {
		Router.route(req, res, next, List.showList);
	});
};
