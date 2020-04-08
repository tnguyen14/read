'use strict';

const list = require('./controllers/list');
const articles = require('./controllers/articles');
const extract = require('./controllers/extract');
const logger = require('./logger');

function route(controller) {
	return function (req, res, next) {
		controller(req.params).then(
			(result) => {
				res.json(result);
				next();
			},
			(err) => {
				logger.error(err, req);
				next(err);
			}
		);
	};
}

module.exports = function router(server) {
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
