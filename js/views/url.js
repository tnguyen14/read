'use strict';

var InputView = require('ampersand-input-view');
var xhr = require('xhr');

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
			url: 'http://inspired-read.herokuapp.com/extract/' +  encodeURIComponent(url)
		}, function (err, resp, body) {
			if (err) { return; }
			if (resp.statusCode !== 200) {
				// example body response
				// '{"message":"{\"error_code\": 400, \"error_message\": \"Invalid URL: www\", \"type\": \"error\"}"}'
				try {
					self.serverError= JSON.parse(JSON.parse(body).message).error_message;
				} catch (err) {
					self.serverError = body;
				}
				self.trigger('change:inputValue');
				return;
			} else {
				self.serverError = '';
				self.trigger('change:inputValue');
			}
			var data;
			try {
				data = JSON.parse(body);
			} catch (err) {
				self.parseError = err;
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
