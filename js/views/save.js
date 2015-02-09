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
			if (err) {
				return;
			}
			var data;
			try {
				data = JSON.parse(body);
			} catch (err) {

			}
			self.model.title = data.title;
			self.model.description = data.description;
		});
	}
});

var TitleView = InputView.extend({
	bindings: extend({}, InputView.prototype.bindings, {
		'model.title': {
			type: 'value',
			selector: 'input'
		}
	})
});

var DescriptionView = InputView.extend({
	bindings: extend({}, InputView.prototype.bindings, {
		'model.description': {
			type: 'value',
			selector: 'textarea'
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
