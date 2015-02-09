'use strict';

var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var extend = require('amp-extend');

var UrlView = require('./url');

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
