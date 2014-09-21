'use strict';

var db = require('../db');

exports.showAll = function (params) {
  return db.collection(params.list).find().sort({timestamp: -1});
}

exports.newArticle = function (params) {
  var url = params.url,
    title = params.title,
    desc = params.description,
    sharer = params.sharer,
    timestamp = moment.tz('America/New_York').toDate();
  if (sharer === 'other') {
    sharer = params.sharer_email;
  }
  return db.collection(params.list).insert({
    url: url,
    title: title,
    description: desc,
    sharer: sharer,
    timestamp: timestamp,
    sent: false
  });
}
