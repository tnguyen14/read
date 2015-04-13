'use strict';

var Model = require('ampersand-model');

module.exports = Model.extend({
	idAttribute: '_id',
	props: {
		link: {
			type: 'string',
			required: true,
			default: '',
			allowNull: true
		},
		_id: 'string',
		title: 'string',
		description: 'string',
		favorite: 'boolean',
		note: 'string',
		status: 'string'
	}
});
