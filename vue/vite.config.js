import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	base: '/battle/',
	plugins: [vue({
		template: {
			compilerOptions: {
				isCustomElement: tag => {
					return tag.startsWith('ion-')
				}
			}
		}
	})],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
	server: {
		host: true,
		port: 8000
	}
})
