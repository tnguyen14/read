'use strict';

var _ = require('lodash');
var restifyErrors = require('restify-errors');

// @TODO remove when implementing auth
const user = process.env.AUTH0_USER;

const firestore = require('@tridnguyen/firestore');
const missingListNameError = new restifyErrors.MissingParameterError('List name is required.');
const noArticleFoundError = new restifyErrors.ResourceNotFoundError('No such article was found');

module.exports.showAll = function (params) {
	if (!params.list) {
		return Promise.reject(missingListNameError);
	}
	const after = params.after ? Number(params.after) : new Date(0).valueOf();
	const before = params.before ? Number(params.before) :  Date.now();
	const limit = Number(params.limit) || 1000;
	const order = params.order || 'desc';

	const articlesRef = firestore.doc(`lists/${user}!${params.list}`).collection('articles');

	return articlesRef
		.where('id', '>', String(after))
		.where('id', '<', String(before))
		.orderBy('id', order)
		.limit(limit)
		.get()
		.then(articlesSnapshot => {
			return articlesSnapshot.docs.map(articleSnapshot => articleSnapshot.data());
		});
};

module.exports.newArticle = function (params) {
	if (!params.list) {
		return Promise.reject(missingListNameError);
	}
	var id = String(Date.now());
	return firestore.doc(`lists/${user}!${params.list}`).collection('articles')
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
			return {
				created: true,
				id
			};
		});
};

module.exports.showOne = function (params) {
	if (!params.list) {
		return Promise.reject(missingListNameError);
	}
	const articleRef = firestore.doc(`lists/${user}!${params.list}`).collection('articles').doc(params.id);

	return articleRef.get().then(articleSnapshot => {
		if (!articleSnapshot.exists) {
			throw noArticleFoundError;
		}
		return articleSnapshot.data();
	});
}

exports.updateArticle = function (params) {
	if (!params.list) {
		return Promise.reject(missingListNameError);
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
	return articleRef.get().then(articleSnapshot => {
		if (!articleSnapshot.exists) {
			throw noArticleFoundError;
		}
		const article = articleSnapshot.data();
		const updatedArticle = Object.assign(article, _.pick(params, supportedProperties), {
			updatedOn: Date.now()
		});
		return articleRef.set(updatedArticle);
	}).then(() => {
		return {
			updated: true
		};
	});
};

exports.deleteArticle = function (params) {
	if (!params.list) {
		return Promise.reject(missingListNameError);
	}
	return firestore.doc(`lists/${user}!${params.list}`)
		.collection('articles').doc(params.id)
		.delete()
		.then(() => {
			return {
				deleted: true
			};
		});
};
