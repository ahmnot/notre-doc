import adapter from 'svelte-kit-sst';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			'genql': '../graphql/genql',
			"@notre-doc/core/*": "../core/src/*",
			"@notre-doc/functions/*": "../functions/src/*",
			"@notre-doc/graphql/*": "../graphql/*",
		}
	}
};

export default config;
