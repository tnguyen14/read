'use strict';

var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var extend = require('amp-extend');

var UrlView = InputView.extend({
	events: {
		'change input': 'extract'
	},
	extract: function (e) {
		var url = e.target.value;
		if (url === '') {
			return;
		}
		this.model.url = url;
		this.model.title = 'Something';
		this.model.description = 'Description';
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
