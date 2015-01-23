'use strict';

var db = require('../db');
var _ = require('lodash');
var ObjectId = require('mongod').ObjectId;
var moment = require('moment-timezone');
var xtend = require('xtend');

exports.showAll = function (params) {
  var query = {};
  if (params.after) {
    query.timestamp = {$gt: moment(params.after).toDate()};
  }
  if (params.before) {
    query.timestamp = xtend(query.timestamp, {$lt: moment(params.before).toDate()});
  }
  return db.collection(params.list).find(query).sort({timestamp: -1}).limit(25);
};

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
};

exports.updateArticle = function (params) {
  var articleId = new ObjectId(params._id);
  params.updatedOn = moment.tz('America/New_York').toDate();
  var list = db.collection(params.list);
  return list.findOne({_id: articleId}).then(function (article) {
    var updatedArticle = _.extend(article, _.pick(params, ['url', 'title', 'description', 'sharer', 'updatedOn', 'sent']));
    return list.update({_id: articleId}, {$set: updatedArticle});
  });
};

exports.deleteArticle = function (params) {
  return db.collection(params.list).remove({_id: new ObjectId(params._id)});
}
