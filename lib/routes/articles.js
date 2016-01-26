'use strict';

var Router = require('../router');
var ObjectId = require('mongod').ObjectId;
var Articles = require('../controllers/articles');
var restify = require('restify');

var listNameError = new restify.errors.MissingParameterError('List name is required');
var objectIdError = new restify.errors.InvalidArgumentError('ObjectId is not valid');

module.exports = function (server) {
	server.get('/:list/articles', function (req, res, next) {
		if (!req.params.list) {
			return next(listNameError);
		}
		Router.route(req, res, next, Articles.showAll);
	});

	server.post('/:list/articles', function (req, res, next) {
		if (!req.params.list) {
			return next(listNameError);
		}
		Router.route(req, res, next, Articles.newArticle);
	});

	server.patch('/:list/articles/:_id', function (req, res, next) {
		if (!req.params.list) {
			return next(listNameError);
		}
		if (!ObjectId.isValid(req.params._id)) {
			throw objectIdError;
		}
		Router.route(req, res, next, Articles.updateArticle);
	});

	server.del('/:list/articles/:_id', function (req, res, next) {
		if (!req.params.list) {
			return next(listNameError);
		}
		if (!ObjectId.isValid(req.params._id)) {
			throw objectIdError;
		}
		Router.route(req, res, next, Articles.deleteArticle);
	});
};
