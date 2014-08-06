'use strict';

var mongo = require('mongod'),
  ObjectId = mongo.ObjectId,
  moment = require('moment-timezone'),
  nodemailer = require('nodemailer'),
  Handlebars = require('handlebars'),
  fs = require('fs'),
  Promise = require('promise'),
  _ = require('lodash');

var DBURL = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/sg-read';
var db = mongo(DBURL, ['shared']);
var readfile = Promise.denodeify(fs.readFile);
var itemTemplate;

var transporter = nodemailer.createTransport({
  service: 'mailgun',
  auth: {
      user: process.env.MAILGUN_SMTP_LOGIN,
      pass: process.env.MAILGUN_SMTP_PASSWORD
  }
});
var sendarticles = function (items, cb) {
  var ids = _.map(items, function (item) {
    return new ObjectId(item._id);
  });
  var html = '<p>Good morning! Here are a few things we thought you might find awesome. If you read something similarly awesome recently, don\'t forget to <a  href="http://tnguyen14.github.io/sg-read">share it with the world</a>!</p>';
  _.each(items, function (item) {
    html += itemTemplate(item);
  });

  html += '<p>--Brought to you from the <a href="https://www.youtube.com/watch?v=StTqXEQ2l-Y">awesome</a> people of SiteGenesis</p>'
  var mailOptions = {
    from: 'SiteGenesis Read <sg-read@app27681703.mailgun.org>',
    to: 'sg-list@app27681703.mailgun.org',
    replyTo: 'sg-list@app27681703.mailgun.org',
    subject: 'SiteGenesis Read ' + moment().tz('America/New_York').format('M/D/YYYY'),
    html: html
  };
  var promise = new Promise(function (resolve, reject) {
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        reject(err);
      } else {
        // mark articles as sent
        db.shared.update({_id: {$in: ids}}, {$set: {sent: true}}, {multi: true}).then(function (result) {
          resolve(result);
        }, function (err) {
          resolve(err);
        });
      }
    });
  });

  return promise;
};

Handlebars.registerHelper('getDate', function (date, format) {
  return moment(date).format(format);
});

readfile('./templates/item.hbs', {encoding: 'utf8'}).then(function (result) {
  itemTemplate = Handlebars.compile(result);
}).then(function () {
  db.shared.find({sent: {$ne: true}}).sort({timestamp: -1}).then(function (items) {
    if (items.length > 0) {
      sendarticles(items).then(function (result) {
        console.log('Successfully sent out email for ' + items.length + ' items');
        if (!(result.hasOwnProperty('ok') && result.ok)) {
          console.log('Unable to update articles `sent` property');
        }
        db.close();
      }, function (err) {
        console.log(err);
        db.close();
      });
    } else {
      db.close();
    }
  }, function (err) {
    console.log(err);
    db.close();
  });
}).done();
