'use strict';

var list = require('./controllers/list');
var articles = require('./controllers/articles');
var extract = require('./controllers/extract');

function route (controller) {
	return function (req, res, next) {
		controller(req.params)
			.then(result => {
				res.json(result);
				next();
			}, err => {
				console.error(err);
				next(err);
			});
	};
}

module.exports = function router (server) {
	// extract
	server.get('/extract', route(extract));

	// list routes
	server.get('/', route(list.showAll));
	server.post('/', route(list.newList));
	server.get('/:list', route(list.showList));

	// articles routes
	server.get('/:list/articles', route(articles.showAll));
	server.post('/:list/articles', route(articles.newArticle));
	server.get('/:list/articles/:id', route(articles.showOne));
	server.patch('/:list/articles/:id', route(articles.updateArticle));
	server.del('/:list/articles/:id', route(articles.deleteArticle));
};
