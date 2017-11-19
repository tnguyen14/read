// docs: https://googlecloudplatform.github.io/google-cloud-node/#/docs/datastore/1.1.0/datastore

/* eslint-disable no-console */

const Datastore = require('@google-cloud/datastore');
const r2 = require('r2');
const LIST_ID = 'tri';
const LEGACY_API_URL = 'https://api.tridnguyen.com/read';

const datastore = Datastore({
	keyFilename: `credentials/${process.env.CREDENTIAL_JSON}`
});

let tally = {
	success: 0,
	failure: 0
}
r2(`${LEGACY_API_URL}/${LIST_ID}`).json.then(list => {
	return Promise.all(list.articles.map(article => {
		return new Promise((resolve) => {
			datastore.save({
				key: datastore.key(['ReadItem']),
				data: Object.assign({}, article, {
					favorite: true
				})
			}, (err) => {
				if (err) {
					tally.failure++;
					resolve();
				}
				tally.success++;
				resolve();
			});
		});
	}));
}).then(() => {
	console.log(`Finished. Updated/ added successfully: ${tally.success}. Failures: ${tally.failure}.`);
}).catch(err => {
	console.error(err);
	process.exit(1);
});
