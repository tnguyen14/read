'use strict';

var level = require('level');

module.exports = level('./data', {valueEncoding: 'json'});

const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore({
	projectId: process.env.FIRESTORE_PROJECT_ID,
	keyFilename: process.env.SERVICE_ACCOUNT_JSON
});

module.exports.firestore = firestore;

const FIRESTORE_BATCH_SIZE = 500;

module.exports.firestore.batchSize = FIRESTORE_BATCH_SIZE;
