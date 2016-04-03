'use strict';

var request = require('request');
var restifyErrors = require('restify-errors');

function getArticleDetails (params, callback) {
	if (!params.url) {
		callback(new restifyErrors.MissingParameterError('URL is required'));
	}
	var requestUrl = 'https://api.embed.ly/1/extract?';
	requestUrl += 'key=' + process.env.EMBEDLY_API;
	requestUrl += '&url=' + encodeURIComponent(params.url);
	requestUrl += '&format=json';
	request(requestUrl, function (error, response, body) {
		if (error) {
			return callback(error);
		}
		var result = JSON.parse(body);
		if (result.type === 'error') {
			return callback(restifyErrors.makeErrFromCode(result.error_code, result.error_message));
		}
		callback(null, result);
	});
}

module.exports = getArticleDetails;
