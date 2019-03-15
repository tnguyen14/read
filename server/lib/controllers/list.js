const restifyErrors = require('restify-errors');

const firestore = require('@tridnguyen/firestore');
// @TODO hard-code user for now, until auth is implemented
const user = process.env.AUTH0_USER;

const missingListNameError = new restifyErrors.MissingParameterError('List name is required.');
const noListFoundError = new restifyErrors.ResourceNotFoundError('No such list was found');
const conflictNameError = new restifyErrors.ConflictError('A list with the same name already exists.');

module.exports.showAll = function (params, callback) {
	firestore.collection('lists')
		.where('user', '==', user)
		.get()
		.then(listsSnapshot => {
			callback(null, listsSnapshot.docs.map(listDoc => listDoc.data()));
		}, callback);
};

module.exports.showList = function (params, callback) {
	if (!params.list) {
		return callback(missingListNameError);
	}
	const listRef = firestore.doc(`lists/${user}!${params.list}`);
	listRef.get().then(listSnapshot => {
		if (!listSnapshot.exists) {
			callback(noListFoundError);
			return;
		}
		// @TODO get articles
		callback(null, listSnapshot.data());
	}, callback);
};

module.exports.newList = function (params, callback) {
	if (!params.name) {
		return callback(missingListNameError);
	}
	const listRef = firestore.doc(`lists/${user}!${params.name}`);
	listRef.get().then(listSnapshot => {
		if (listSnapshot.exists) {
			return callback(conflictNameError);
		}
		listRef.create({
			user,
			id: params.name,
			tags: []
		}).then(() => {
			callback(null, {
				created: true
			});
		}, callback);
	});
};
