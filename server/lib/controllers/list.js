const restifyErrors = require('restify-errors');

const firestore = require('@tridnguyen/firestore');
// @TODO hard-code user for now, until auth is implemented
const user = process.env.AUTH0_USER;

const missingListNameError = new restifyErrors.MissingParameterError(
	'List name is required.'
);
const noListFoundError = new restifyErrors.ResourceNotFoundError(
	'No such list was found'
);
const conflictNameError = new restifyErrors.ConflictError(
	'A list with the same name already exists.'
);

module.exports.showAll = function () {
	return firestore
		.collection('lists')
		.where('user', '==', user)
		.get()
		.then((listsSnapshot) => {
			return listsSnapshot.docs.map((listDoc) => listDoc.data());
		});
};

module.exports.showList = function (params) {
	if (!params.list) {
		return Promise.reject(missingListNameError);
	}
	const listRef = firestore.doc(`lists/${user}!${params.list}`);
	return listRef.get().then((listSnapshot) => {
		if (!listSnapshot.exists) {
			throw noListFoundError;
		}
		// @TODO get articles
		return listSnapshot.data();
	});
};

module.exports.newList = function (params) {
	if (!params.name) {
		return Promise.reject(missingListNameError);
	}
	const listRef = firestore.doc(`lists/${user}!${params.name}`);
	return listRef.get().then((listSnapshot) => {
		if (listSnapshot.exists) {
			throw conflictNameError;
		}
		return listRef
			.create({
				user,
				id: params.name,
				tags: []
			})
			.then(() => {
				return {
					created: true
				};
			});
	});
};
