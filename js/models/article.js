'use strict';

var Model = require('ampersand-model');

module.exports = Model.extend({
	props: {
		url: ['string', true, ''],
		title: ['string', false, ''],
		description: 'string',
		favorite: 'boolean',
		note: 'string',
		status: 'string'
	}
});
