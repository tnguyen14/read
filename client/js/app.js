'use strict';

var MainView = require('./views/main');

var main = new MainView({
	el: document.querySelector('.main')
});
main.render();
