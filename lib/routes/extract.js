'use strict';

var request = require('request-promise');
var Router = require('../router');
var EMBEDLY_API = process.env.EMBEDLY_API;

function getArticleDetails (params) {
	if (!params.url) {
		throw new Error('url is required');
	}
	var requestUrl = 'http://api.embed.ly/1/extract?';
	requestUrl += 'key=' + EMBEDLY_API;
	requestUrl += '&url=' + encodeURIComponent(params.url);
	requestUrl += '&format=json';
	return request(requestUrl).then(function (body) {
		return JSON.parse(body);
	}, function (response) {
		// Embedly returns a big response object for error
		throw new Error(response.error);
	});
}

module.exports = function (server) {
	server.get('/extract', function (req, res, next) {
		Router.route(req, res, next, getArticleDetails);
	});
};
