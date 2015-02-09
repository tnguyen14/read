'use strict';

var View = require('ampersand-view');
var template = require('../../templates/main.hbs');
var SaveFormView = require('./save');
var ArticleModel = require('../models/article');
var InputView = require('ampersand-input-view');

module.exports = View.extend({
	template: template,
	render: function () {
		this.renderWithTemplate();
		this.save = new SaveFormView({
			el: this.query('.save'),
			model: new ArticleModel()
		});
		this.renderSubview(this.save);
		return this;
	}
});
