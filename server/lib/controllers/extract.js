'use strict';

var request = require('request');
var restifyErrors = require('restify-errors');

function getArticleDetails(params) {
	if (!params.url) {
		return Promise.reject(
			new restifyErrors.MissingParameterError('URL is required')
		);
	}
	var requestUrl = 'https://api.embed.ly/1/extract?';
	requestUrl += 'key=' + process.env.EMBEDLY_API;
	requestUrl += '&url=' + encodeURIComponent(params.url);
	requestUrl += '&format=json';
	return new Promise((resolve, reject) => {
		request(requestUrl, function (error, response, body) {
			if (error) {
				return reject(error);
			}
			var result = JSON.parse(body);
			if (result.type === 'error') {
				return reject(
					restifyErrors.makeErrFromCode(result.error_code, result.error_message)
				);
			}
			resolve(result);
		});
	});
}

module.exports = getArticleDetails;
