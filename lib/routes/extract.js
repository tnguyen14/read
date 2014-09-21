'use strict';

var request = request = require('request');

var EMBEDLY_API = process.env.EMBEDLY_API;

module.exports = function (server) {
  server.get('/extract/:url', function (req, res, next) {
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
};
