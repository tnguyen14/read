#!/usr/bin/env node

var backup = require('./backup.json');
var db = require('level')('./data', {valueEncoding: 'json'});
var moment = require('moment-timezone');

var articles = backup.map(function (article) {
	var id = moment(article.timestamp).valueOf();
	return {
		type: 'put',
		key: 'article!tri!' + id,
		value: {
			link: article.link,
			title: article.title,
			description: article.description,
			favorite: article.favorite,
			note: '',
			status: 'READ'
		}
	};
});

db.batch(articles, function (err) {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log('Migrated ' + articles.length + ' articles successfully.');
	process.exit();
});
