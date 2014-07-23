'use strict';

var mongo = require('mongod'),
  ObjectId = mongo.ObjectId,
  moment = require('moment-timezone'),
  nodemailer = require('nodemailer'),
  Promise = require('promise'),
  _ = require('lodash');

var DBURL = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/sg-read';
var db = mongo(DBURL, ['shared']);

var transporter = nodemailer.createTransport({
  service: 'mailgun',
  auth: {
      user: process.env.MAILGUN_SMTP_LOGIN,
      pass: process.env.MAILGUN_SMTP_PASSWORD
  }
});
var sendmail = Promise.denodeify(transporter.sendMail);

db.shared.find({sent: {$ne: true}}).then(function (items) {
  if (items.length > 0) {
     sendarticles(items, function (err, success) {
      db.close();
    });
  }
})

var sendarticles = function (items, cb) {
  var ids = _.map(items, function (item) {
    return new ObjectId(item._id);
  });
  var html = '';
  _.each(items, function (item) {
    html += item;
  });
  var mailOptions = {
    from: 'SiteGenesis Read <sg-read@app27681703.mailgun.org>',
    to: 'sg-list@app27681703.mailgun.org',
    replyTo: 'sg-list@app27681703.mailgun.org',
    subject: 'SiteGenesis Read ' + moment().tz('America/New_York').format('M/D/YYYY'),
    html: html
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      cb(err);
    } else {
      db.shared.update({_id: {$in: ids}}, {$set: {sent: true}}, {multi: true}).then(function (result) {
        cb(null, result);
      }, function (err) {
        cb(null, err);
      });
    }
  })
}
