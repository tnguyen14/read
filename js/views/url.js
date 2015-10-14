'use strict';

var InputView = require('ampersand-input-view');
var xhr = require('xhr');
var config = require('config');

module.exports = InputView.extend({
	events: {
		'change input': 'extract'
	},
	extract: function (e) {
		var url = e.target.value;
		var self = this;
		if (url === '') {
			return;
		}
		this.model.url = url;
		xhr({
			url: config.API_URL + 'extract?url=' + encodeURIComponent(url)
		}, function (err, resp, body) { // eslint-disable-line max-statements
			if (err) {
				self.serverError = 'Unable to contact the server at this time. Please try again later.';
				self.trigger('change:inputValue');
				return;
			}
			if (resp.statusCode !== 200) {
				self.serverError = 'Unable to extract information from the URL. ' +
					'Please enter the data manually.\n';
				// example body response
				// '{"message":"{\"error_code\": 400, \"error_message\": \"Invalid URL: www\",
				//  \"type\": \"error\"}"}'
				try {
					self.serverError += JSON.parse(JSON.parse(body).message).error_message;
				} catch (error) {
					self.serverError += body;
				}
				self.trigger('change:inputValue');
				// use empty space to trigger display input fields
				self.model.title = ' ';
				self.model.description = ' ';
				return;
			} else {
				self.trigger('change:inputValue');
			}
			var data;
			try {
				data = JSON.parse(body);
				self.model.title = data.title;
				self.model.description = data.description;
			} catch (error) {
				self.parseError = 'Unable to parse the response, please enter the data manually.\n' + error;
			}
		});
	},
	tests: [
		function () {
			/* eslint-disable no-invalid-this */
			if (this.serverError) {
				return this.serverError;
			}
			if (this.parseError) {
				return this.parseError;
			}
			/* eslint-enable no-invalid-this */
		}
	]
});
