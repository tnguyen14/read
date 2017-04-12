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
		var button = e.delegateTarget;
		if (button.getAttribute('data-confirm') === 'false') {
			button.classList.add('confirm');
			button.setAttribute('data-confirm', 'true');
			return;
		}
		this.model.destroy({
			success: function () {
				// @TODO: handle notification
			}
		});
	}
});
