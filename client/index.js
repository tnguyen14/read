import App from './App.svelte';

window.API_URL = 'https://read.cloud.tridnguyen.com';
window.COLLECTION = 'tri';

const app = new App({
	target: document.body,
	props: {}
});

export default app;
