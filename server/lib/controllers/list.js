'use strict';

var db = require('../db');
var restifyErrors = require('restify-errors');
var articles = require('./articles');

var missingListNameError = new restifyErrors.MissingParameterError('List name is required.');
var noListFoundError = new restifyErrors.ResourceNotFoundError('No such list was found');

exports.showAll = function (params, callback) {
	var lists = [];
	db.createReadStream({
		gte: 'list!',
		lte: 'list!~'
	})
	.on('data', function (list) {
		lists.push(list);
	})
	.on('error', callback)
	.on('close', function () {
		callback(null, lists);
	});
};

exports.showList = function (params, callback) {
	if (!params.list) {
		return callback(missingListNameError);
	}
	db.get('list!' + params.list, function (err, list) {
		if (err) {
			if (err.message.indexOf('Key not found') !== -1) {
				callback(noListFoundError);
			} else {
				callback(err);
			}
			return;
		}
		articles.showAll(params, function (err, articles) {
			if (err) {
				return callback(err);
			}
			list.articles = articles;
			callback(null, list);
		});
	});
};

exports.newList = function (params, callback) {
	if (!params.name) {
		return callback(missingListNameError);
	}
	db.put('list!' + params.name, {
		tags: []
	}, function (err) {
		if (err) {
			return callback(err);
		}
		callback(null, {
			created: true
		});
	});
};
