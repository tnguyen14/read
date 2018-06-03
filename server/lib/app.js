/*
 * read-server
 * https://github.com/tnguyen14/read-server
 *
 * Copyright (c) 2016 Tri Nguyen
 * Licensed under the MIT license.
 */

'use strict';

var restify = require('restify');
var db = require('./db');

var server = restify.createServer({
	name: 'inspired-read',
	version: '0.1.0'
});

server.use(restify.CORS());
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

/* Router */
require('./router')(server);

server.listen(3000, function () {
	console.log('%s listening at %s', server.name, server.url);
});

function closeServer () {
	db.close(function () {
		server.close();
		process.exit();
	});
}

process.on('SIGINT', closeServer).on('SIGTERM', closeServer);
