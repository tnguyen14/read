'use strict';

var View = require('ampersand-view');
var template = require('../../templates/article.hbs');

module.exports = View.extend({
	template: template,
	events: {
		'click .article-remove': 'removeArticle'
	},
	render: function () {
		this.renderWithTemplate(this.model);
	},
	removeArticle: function (e) {
		if (e.target.getAttribute('data-confirm') === 'false') {
			e.target.setAttribute('data-confirm', 'true');
			return;
		}
		this.model.destroy({
			success: function () {
				// @TODO: handle notification
			}
		});
	}
});
