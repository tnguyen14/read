'use strict';

var MainView = require('./views/main');
var transformicons = require('./lib/transformicons');

var main = new MainView({
	el: document.querySelector('.main')
});
main.render();

transformicons.add('.tcon');
