'use strict';

var View = require('ampersand-view');
var template = require('../../templates/main.hbs');
var SaveFormView = require('./save');
var ArticlesView = require('./articles');
var ArticleModel = require('../models/article');
var InputView = require('ampersand-input-view');
var Collection = require('ampersand-collection');
var ArticlesCollection = Collection.extend({
	model: ArticleModel
});

module.exports = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate();
		this.save = new SaveFormView({
			el: this.query('.save'),
			model: new ArticleModel()
		});
		this.renderSubview(this.save);
		this.articles = new ArticlesView({
			collection: new ArticlesCollection(),
			el: this.query('.articles')
		});
		this.renderSubview(this.articles);
		return this;
	}
});
