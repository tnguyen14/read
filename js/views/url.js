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
			url: config.API_URL + 'extract/' +  encodeURIComponent(url)
		}, function (err, resp, body) {
			if (err) {
				self.serverError = 'Unable to contact the server at this time. Please try again later.';
				self.trigger('change:inputValue');
				return;
			}
			if (resp.statusCode !== 200) {
				self.serverError = 'Unable to extract information from the URL. Please enter the data manually.\n';
				// example body response
				// '{"message":"{\"error_code\": 400, \"error_message\": \"Invalid URL: www\", \"type\": \"error\"}"}'
				try {
					self.serverError += JSON.parse(JSON.parse(body).message).error_message;
				} catch (err) {
					self.serverError += body;
				}
				self.trigger('change:inputValue');
				// use empty space to trigger display input fields
				self.model.title = ' ';
				self.model.description = ' ';
				return;
			} else {
				self.serverError = '';
				self.trigger('change:inputValue');
			}
			var data;
			try {
				data = JSON.parse(body);
			} catch (err) {
				self.parseError = 'Unable to parse the response, please enter the data manually.\n' + err;
			}
			self.model.title = data.title;
			self.model.description = data.description;
		});
	},
	tests: [
		function (value) {
			if (this.serverError) {
				return this.serverError;
			}
			if (this.parseError) {
				return this.parseError;
			}
		}
	]
});
