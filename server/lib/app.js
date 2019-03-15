var restify = require('restify');
var db = require('./db');

var server = restify.createServer({
	name: 'inspired-read',
	version: '0.1.0'
});

const corsMiddleware = require('restify-cors-middleware');
const cors = corsMiddleware({
	origins: ['localhost', 'https://tridnguyen.com']
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser({
	mapParams: true
}));
server.use(restify.plugins.jsonBodyParser({
	mapParmas: true
}));

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
