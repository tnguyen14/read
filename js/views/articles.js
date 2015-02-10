'use strict';

var View = require('ampersand-view');
var ArticleView = require('./article');
var template = require('../../templates/articles.hbs');

module.exports = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate();
		this.renderCollection(this.collection, ArticleView);
	}
});
