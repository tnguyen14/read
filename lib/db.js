'use strict';

var mongod = require('mongod');
var DBURL = process.env.MONGO_URL || 'mongodb://localhost:27017/read';

module.exports = mongod(DBURL);
