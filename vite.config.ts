import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { type ViteDevServer } from 'vite';
import { webSocketServer } from './sockets.js';
import { Server } from 'socket.io';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

export default defineConfig({
	plugins: [sveltekit(), commonjs(), resolve()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
