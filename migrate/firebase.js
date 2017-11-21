// example followed: https://github.com/firebase/quickstart-nodejs/blob/master/database/index.js
/* eslint-disable no-console */
require('dotenv').config();
const firebase = require('firebase-admin');
const r2 = require('r2');
const LIST_ID = 'tri';
const LEGACY_API_URL = 'https://api.tridnguyen.com/read';

firebase.initializeApp({
	credential: firebase.credential.cert(`credentials/${process.env.FIREBASE_CREDENTIAL_JSON}`),
	databaseURL: 'https://inspired-read.firebaseio.com'
});

r2(`${LEGACY_API_URL}/${LIST_ID}`).json.then(list => {
	let update = {};
	update[`/lists/${LIST_ID}`] = {tags: []};
	list.articles.forEach(article => {
		update[`/articles/${LIST_ID}/${article.id}`] = Object.assign({}, article, {
			favorite: true
		});
	});
	firebase.database().ref().update(update).then(() => {
		console.log('Finished.');
		process.exit();
	}, (err) => {
		console.error(err);
		process.exit(1);
	});
});
