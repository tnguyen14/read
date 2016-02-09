'use strict';

var db = require('../db');
var _ = require('lodash');
var moment = require('moment-timezone');
var restifyErrors = require('restify-errors');

var missingListNameError = new restifyErrors.MissingParameterError('List name is required.');

exports.showAll = function (params, callback) {
	if (!params.list) {
		return callback(missingListNameError);
	}
	var after = params.after ? moment(params.after).valueOf() : '';
	var before = params.before ? moment(params.before).valueOf() : '';
	var articles = [];
	db.createReadStream({
		gte: 'article!' + params.list + '!' + after,
		lte: 'article!' + params.list + '!' + before + '~'
	})
	.on('data', function (article) {
		// pass back the id, which is the timestamp of the article
		// remove all other database prefixes
		articles = [Object.assign({}, article.value, {id: article.key.split('!').pop()})].concat(articles);
	})
	.on('error', callback)
	.on('close', function () {
		callback(null, articles);
	});
};

exports.newArticle = function (params, callback) {
	if (!params.list) {
		return callback(missingListNameError);
	}
	var id = Date.now();
	db.put('article!' + params.list + '!' + id, {
		link: params.link,
		title: params.title,
		description: params.description,
		favorite: !!params.favorite,
		note: params.note || '',
		status: params.status || 'READ'
	}, function (err) {
		if (err) {
			return callback(err);
		}
		callback(null, {
			created: true,
			id: id
		});
	});
};

exports.updateArticle = function (params, callback) {
	if (!params.list) {
		return callback(missingListNameError);
	}
	var supportedProperties = [
		'link',
		'title',
		'description',
		'favorite',
		'note',
		'status'
	];
	db.get('article!' + params.list + '!' + params.id, function (err, article) {
		if (err) {
			return callback(err);
		}
		var updatedArticle = Object.assign(article, _.pick(params, supportedProperties), {
			updatedOn: Date.now()
		});
		db.put('article!' + params.list + '!' + params.id, updatedArticle, function (err) {
			if (err) {
				return callback(err);
			}
			callback(null, {
				updated: true
			});
		});
	});
};

exports.deleteArticle = function (params, callback) {
	if (!params.list) {
		return callback(missingListNameError);
	}
	db.del('article!' + params.list + '!' + params.id, function (err) {
		if (err) {
			return callback(err);
		}
		callback(null, {
			deleted: true
		});
	});
};
