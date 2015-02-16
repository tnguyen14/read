'use strict';

var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var extend = require('amp-extend');

var UrlView = require('./url');

var TitleView = InputView.extend({
	initialize: function () {
		this.listenTo(this.model, 'change:title', function (model, title) {
			this.setValue(title);
		});
	},
	bindings: extend({}, InputView.prototype.bindings, {
		'model.title': {
			type: 'booleanClass',
			yes: 'active',
			no: 'inactive'
		}
	})
});

var DescriptionView = InputView.extend({
	initialize: function () {
		var self = this;
		this.listenTo(this.model, 'change:description', function (model, desc) {
			this.setValue(desc);
		});
	},
	bindings: extend({}, InputView.prototype.bindings, {
		'model.description': {
			type: 'booleanClass',
			yes: 'active',
			no: 'inactive'
		}
	})
});

module.exports = FormView.extend({
	submitCallback: function (obj) {
		this.trigger('newarticle', obj);
	},
	fields: function () {
		return [
			new UrlView({
				name: 'link',
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
			}),
			new InputView({
				name: 'type',
				type: 'hidden',
				value: 'personal',
				parent: this
			})
		];
	}
});
