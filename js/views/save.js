'use strict';

var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var extend = require('amp-extend');
var xhr = require('xhr');

var UrlView = InputView.extend({
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

var TitleView = InputView.extend({
	derived: {
		'showInput': {
			deps: ['model.title'],
			fn: function () {
				return !!this.model.title;
			}
		}
	},
	bindings: extend({}, InputView.prototype.bindings, {
		'model.title': {
			type: 'value',
			selector: 'input'
		},
		'showInput': {
			type: 'booleanClass',
			yes: 'active',
			no: 'inactive'
		}
	})
});

var DescriptionView = InputView.extend({
	derived: {
		'showInput': {
			deps: ['model.description'],
			fn: function () {
				return !!this.model.description;
			}
		}
	},
	bindings: extend({}, InputView.prototype.bindings, {
		'model.description': {
			type: 'value',
			selector: 'textarea'
		},
		'showInput': {
			type: 'booleanClass',
			yes: 'active',
			no: 'inactive'
		}
	})
});

module.exports = FormView.extend({
	fields: function () {
		return [
			new UrlView({
				name: 'url',
				label: 'Link URL',
				placeholder: 'http://www.coolstuff.com',
				parent: this,
				model: this.model
			}),
			new TitleView({
				name: 'title',
				label: 'Title',
				parent: this,
				model: this.model
			}),
			new DescriptionView({
				name: 'description',
				label: 'Description',
				type: 'textarea',
				parent: this,
				model: this.model
			})
		];
	}
});
