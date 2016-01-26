'use strict';

var db = require('../db');
var _ = require('lodash');
var ObjectId = require('mongod').ObjectId;
var moment = require('moment-timezone');
var xtend = require('xtend');

exports.showAll = function (params) {
	var query = {};
	if (params.after) {
		query.timestamp = {$gt: moment(params.after).toDate()};
	}
	if (params.before) {
		query.timestamp = xtend(query.timestamp, {$lt: moment(params.before).toDate()});
	}
	return db.collection(params.list).find(query).sort({timestamp: -1}).limit(25);
};

exports.newArticle = function (params) {
	var link = params.link;
	var title = params.title;
	var desc = params.description;
	var timestamp = moment.tz('America/New_York').toDate();
	var options = {
		sharer: params.sharer
	};

	// potential support for multiple types of list
	switch (params.type) {
		default:
			if (params.favorite) {
				options.favorite = true;
			} else {
				options.favorite = false;
			}
			if (params.note) {
				options.note = params.note;
			}
			if (params.status) {
				options.status = params.status || 'READ';
			}
			break;
	}

	var article = xtend({
		link: link,
		title: title,
		description: desc,
		timestamp: timestamp
	}, options);

	return db.collection(params.list).insert(article);
};

exports.updateArticle = function (params) {
	var articleId = new ObjectId(params._id);
	params.updatedOn = moment.tz('America/New_York').toDate();
	var list = db.collection(params.list);
	var supportedProperties = [
		'link',
		'title',
		'description',
		'sharer',
		'updatedOn',
		'favorite',
		'note',
		'status'
	];
	return list.findOne({_id: articleId}).then(function (article) {
		var updatedArticle = _.extend(article, _.pick(params, supportedProperties));
		return list.update({_id: articleId}, {$set: updatedArticle});
	});
};

exports.deleteArticle = function (params) {
	return db.collection(params.list).remove({_id: new ObjectId(params._id)});
};
