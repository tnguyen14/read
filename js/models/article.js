'use strict';

var Model = require('ampersand-model');

module.exports = Model.extend({
	props: {
		url: ['string', true, ''],
		title: ['string', false, ''],
		description: 'string'
	},
	derived: {
		hasTitle: {
			deps: ['title'],
			fn: function () {
				return this.title === '';
			}
		},
		hasDescription: {
			deps: ['description'],
			fn: function () {
				return this.description === '';
			}
		}
	}
});
