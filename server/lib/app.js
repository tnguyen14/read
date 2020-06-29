require('dotenv').config();
const restify = require('restify');

var server = restify.createServer({
	name: 'inspired-read',
	version: '0.1.0'
});

const corsMiddleware = require('restify-cors-middleware');
const cors = corsMiddleware({
	origins: ['localhost', 'https://tridnguyen.com', 'https://lab.tridnguyen.com']
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(
	restify.plugins.queryParser({
		mapParams: true
	})
);
server.use(
	restify.plugins.bodyParser({
		mapParams: true
	})
);

/* Router */
require('./router')(server);

server.listen(process.env.PORT || 3000, function () {
	// eslint-disable-next-line no-console
	console.log('%s listening at %s', server.name, server.url);
});
