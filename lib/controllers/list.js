'use strict';

var db = require('../db');
var restify = require('restify');

var noListError = new restify.errors.ResourceNotFoundError('No such list was found');

exports.showAll = function (params) {
	return db.collection('lists').find();
};

exports.showList = function (params) {
	return db.collection('lists').findOne({name: params.list}).then(function (list) {
		if (!list) {
			throw noListError;
		}
		return db.collection(params.list).find().sort({timestamp: -1}).then(function (articles) {
			list.articles = articles;
			return list;
		});
	});
};

exports.newList = function (params) {
	var newList = {
		name: params.name,
		tags: [],
		users: []
	};

	return db.collection('lists').insert(newList);
};
