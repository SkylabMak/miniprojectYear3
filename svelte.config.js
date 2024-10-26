import adapter from '@sveltejs/adapter-auto';
// import adapter from '@mdd95/sveltekit-adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		alias: {
			'@prismaMysql': path.resolve('prisma/generated/clientMysql'),
			'@prismaMongo': path.resolve('prisma/generated/clientMongodb')
		},
		adapter: adapter(),
		// adapter: adapter({
		// 	pluginPath: 'plugin.ts'
		// })
	}
};

export default config;
