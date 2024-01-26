import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	define: {
		'import.meta.env.REACT_APP_URL_BACKEND': JSON.stringify(process.env.REACT_APP_URL_BACKEND),
	},
	server: {
		proxy: {
			'/socket.io': {
			target: process.env.REACT_APP_URL_BACKEND,
			changeOrigin: true,
			ws: true,
			},
		},
		host: true,
		port: 5173,
		watch: {
		usePolling: true
		}
		}
})
