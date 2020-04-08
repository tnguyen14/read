require('dotenv').config();

const chunk = require('lodash.chunk');

const firestore = require('@tridnguyen/firestore');

const { getJson } = require('simple-fetch');

const user = process.env.AUTH0_USER;
const authToken = process.env.AUTH_TOKEN;
const serverUrl = process.env.SYNC_FROM_SERVER_URL;

getJson(`${serverUrl}`, {
	headers: {
		Authorization: `Bearer ${authToken}`
	}
})
	.then((lists) => {
		return Promise.all(
			lists.map((list) => {
				console.log(`Syncing list for user ${user}`);
				// @TODO delete list first
				// old API has list has
				// {key: 'list!tri', value: {tags: []}}
				if (list.key && list.value) {
					list.id = list.key.split('!')[1];
					list.tags = list.value.tags;
					list.user = user;
					delete list.key;
					delete list.value;
				}
				return writeList(list).then(() => {
					return writeArticlesInChunks(list);
				});
			})
		);
	})
	.then(null, (err) => {
		console.error(err);
	});

function writeList(list) {
	const listRef = firestore.doc(`lists/${list.user}!${list.id}`);
	return listRef.set(list).then(() => {
		console.log(`Successfully created list ${list.id} for user ${list.user}`);
	});
}

function writeArticlesInChunks(list) {
	return getJson(`${serverUrl}/${list.id}/articles`, {
		headers: {
			Authorization: `Bearer ${authToken}`
		}
	}).then((articles) => {
		if (!articles.length) {
			return;
		}
		console.log(`Writing ${articles.length} articles...`);
		const articlesChunks = chunk(articles, firestore.batchSize);

		return Promise.all(articlesChunks.map(writeArticles.bind(null, list))).then(
			() => {
				console.log(`Finished writing all articles for list ${list.id}`);
			}
		);
	});
}

function writeArticles(list, articles) {
	const writeBatch = firestore.batch();

	articles.forEach((article) => {
		const articleRef = firestore.doc(
			`lists/${list.user}!${list.id}/articles/${article.id}`
		);
		writeBatch.set(articleRef, article);
	});

	return writeBatch.commit().then(() => {
		console.log(`Wrote ${articles.length} articles for list ${list.id}`);
	});
}
