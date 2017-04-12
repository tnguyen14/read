'use strict';

var View = require('ampersand-view');
var ArticleView = require('./article');
var template = require('../../templates/articles.hbs');

module.exports = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate();
		this.loader = document.createElement('div');
		this.loader.classList.add('loader');
		this.el.appendChild(this.loader);
		this.collection.fetch().then(function () {
			this.renderCollection(this.collection, ArticleView);
			this.el.removeChild(this.loader);
		}.bind(this), function () {
			this.el.appendChild(document.createTextNode('Unable to fetch articles at this time.'));
			this.el.removeChild(this.loader);
		}.bind(this));
	}
});
