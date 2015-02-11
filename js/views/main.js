'use strict';

var View = require('ampersand-view');
var template = require('../../templates/main.hbs');
var SaveFormView = require('./save');
var ArticlesView = require('./articles');
var ArticleModel = require('../models/article');
var InputView = require('ampersand-input-view');
var Collection = require('ampersand-rest-collection');
var config = require('config');
var sync = require('ampersand-sync-with-promise');
var ArticlesCollection = Collection.extend({
	model: ArticleModel,
	url: config.API_URL + config.API_COLLECTION + '/articles',
	sync: sync
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
		this.listenTo(this.save, 'newarticle', function (article) {
			this.articles.collection.create(article, {wait: true})
		}.bind(this));
		return this;
	}
});
