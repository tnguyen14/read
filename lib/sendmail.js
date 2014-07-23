'use strict';

var mongo = require('mongod'),
  moment = require('moment-timezone'),
  nodemailer = require('nodemailer');

var DBURL = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/sg-read';

var db = mongo(DBURL, ['shared']);

db.shared.find({sent: {$ne: true}}).then(function (results) {
  console.log(results);
});
