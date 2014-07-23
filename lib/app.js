/*
 * sg-read
 * https://github.com/tnguyen14/sg-read-server
 *
 * Copyright (c) 2014 Tri Nguyen
 * Licensed under the MIT license.
 */

'use strict';

var restify = require('restify'),
  mongo = require('mongod'),
  moment = require('moment-timezone'),
  request = require('request');

var DBURL = process.env.MONGOHQ_URL || 'mongodb://localhost:27017/sg-read';
var EMBEDLY_API = process.env.EMBEDLY_API;

var db = mongo(DBURL, ['shared']);
var server = restify.createServer({
  name: 'sg-read',
  version: '0.0.1'
});

server.use(restify.CORS());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/', function (req, res, next) {
  db.shared.find().then(function (results) {
    res.json(results);
    return next();
  }, function (err) {
    return next(err);
  }).done();
});

server.post('/', function (req, res, next) {
  var url = req.params.url,
    title = req.params.title,
    desc = req.params.description,
    sharer = req.params.sharer,
    timestamp = moment.tz('America/New_York').toDate();
  db.shared.insert({
    url: url,
    title: title,
    description: desc,
    sharer: sharer,
    timestamp: timestamp
  }).then(function (result) {
    res.json(result);
    return next();
  }, function (err) {
    return next(err);
  }).done();
});

server.get('/extract/:url', function (req, res, next) {
  console.log('extracting url ' + req.params.url);
  var requestUrl = 'http://api.embed.ly/1/extract?';
  requestUrl += 'key=' + EMBEDLY_API;
  requestUrl += '&url=' + encodeURIComponent(req.params.url);
  requestUrl += '&format=json';
  request(requestUrl, function (err, response, body) {
    if (!err) {
      var responseBody = JSON.parse(body);
      if (response.statusCode == 200) {
        res.json(responseBody);
        return next();
      } else {
        res.send(404, new Error(responseBody.error_message));
        return next();
      }
    } else {
      return next(err);
    }
  });
});

server.listen(process.env.PORT || 3030, function () {
  console.log('%s listening at %s', server.name, server.url);
});

var closeServer = function () {
  db.close().then(function () {
    server.close();
    process.exit();
  })
};

process.on('SIGINT', closeServer).on('SIGTERM', closeServer);
