'use strict';

var db = require('../db');
var _ = require('lodash');
var moment = require('moment-timezone');
var restifyErrors = require('restify-errors');

// @TODO remove when implementing auth
const user = process.env.AUTH0_USER;

const firestore = require('@tridnguyen/firestore');
const missingListNameError = new restifyErrors.MissingParameterError('List name is required.');
const noArticleFoundError = new restifyErrors.ResourceNotFoundError('No such article was found');

module.exports.showAll = function (params, callback) {
	if (!params.list) {
		return callback(missingListNameError);
	}
	const after = params.after ? Number(params.after) : new Date(0).valueOf();
	const before = params.before ? Number(params.before) :  Date.now();
	const limit = Number(params.limit) || 1000;
	const order = params.order || 'desc';

	const articlesRef = firestore.doc(`lists/${user}!${params.list}`).collection('articles');

	articlesRef
		.where('id', '>', String(after))
		.where('id', '<', String(before))
		.orderBy('id', order)
		.limit(limit)
		.get()
		.then(articlesSnapshot => {
			callback(null, articlesSnapshot.docs.map(articleSnapshot => articleSnapshot.data()))
		}, callback);
};

module.exports.newArticle = function (params, callback) {
	if (!params.list) {
		return callback(missingListNameError);
	}
	var id = String(Date.now());
	firestore.doc(`lists/${user}!${params.list}`).collection('articles')
		.doc(id)
		.set({
			link: params.link,
			title: params.title,
			description: params.description,
			favorite: !!params.favorite,
			note: params.note || '',
			status: params.status || 'READ'
		})
		.then(() => {
			console.log(`Created article ${params.title} at ${params.link} with id ${id}`);
			callback(null, {
				created: true,
				id
			});
		}, callback);
};

module.exports.showOne = function (params, callback) {
	if (!params.list) {
		return callback(missingListNameError);
	}
	const articleRef = firestore.doc(`lists/${user}!${params.list}`).collection('articles').doc(params.id);

	articleRef.get().then(articleSnapshot => {
		if (!articleSnapshot.exists) {
			callback(noArticleFoundError);
			return;
		}
		callback(null, articleSnapshot.data());
	}, callback);
}

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
	const articleRef = firestore.doc(`lists/${user}!${params.list}`).collection('articles').doc(params.id);
	articleRef.get().then(articleSnapshot => {
		if (!articleSnapshot.exists) {
			throw noArticleFoundError;
		}
		const article = articleSnapshot.data();
		const updatedArticle = Object.assign(article, _.pick(params, supportedProperties), {
			updatedOn: Date.now()
		});
		return articleRef.set(updatedArticle);
	}, callback).then(() => {
		callback(null, {
			updated: true
		});
	}, callback);
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
