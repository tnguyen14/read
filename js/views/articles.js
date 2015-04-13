'use strict';

var View = require('ampersand-view');
var ArticleView = require('./article');
var Loader = require('./loader');
var template = require('../../templates/articles.hbs');

module.exports = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate();
		this.loader = new Loader().render();
		this.el.appendChild(this.loader.el);
		this.collection.fetch().then(function () {
			this.renderCollection(this.collection, ArticleView);
			this.loader.remove();
		}.bind(this), function () {
			this.el.appendChild(document.createTextNode('Unable to fetch articles at this time.'));
			this.loader.remove();
		}.bind(this));
	}
});
