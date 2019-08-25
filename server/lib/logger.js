const Rollbar = require('rollbar');
module.exports = new Rollbar({
	accessToken: '924f5f1308a24bbdb349a3233e06db1f',
	captureUncaught: true,
	captureUnhandledRejections: true,
	environment: process.env.NODE_ENV
});
