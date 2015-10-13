'use strict';

var mongod = require('mongod');
var DBURL = 'mongodb://mongodb:27017/read';

module.exports = mongod(DBURL);
