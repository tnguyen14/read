/*
 * sg-read
 * https://github.com/tnguyen14/sg-read-server
 *
 * Copyright (c) 2014 Tri Nguyen
 * Licensed under the MIT license.
 */

'use strict';

var restify = require('restify');
var db = require('./db');

var EMBEDLY_API = process.env.EMBEDLY_API;

var server = restify.createServer({
  name: 'sg-read',
  version: '0.0.1'
});

server.use(restify.CORS());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

/* Routes */

require('./routes/list')(server);
require('./routes/articles')(server);
require('./routes/extract')(server);

server.listen(process.env.PORT || 3030, function () {
  console.log('%s listening at %s', server.name, server.url);
});

var closeServer = function () {
  db.close().then(function () {
    server.close();
    process.exit();
  });
};

process.on('SIGINT', closeServer).on('SIGTERM', closeServer);
