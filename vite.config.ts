import path from "node:path";
import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { defineConfig } from "vite";

export default defineConfig({
	environments: {
		client: {
			build: {
				rollupOptions: {
					input: {
						index: "./src/framework/entry.browser.tsx",
					},
				},
			},
		},
		rsc: {
			build: {
				rollupOptions: {
					input: {
						index: "./src/framework/entry.rsc.tsx",
					},
					output: {
						inlineDynamicImports: true,
					},
				},
			},
		},
		ssr: {
			build: {
				rollupOptions: {
					input: {
						index: "./src/framework/entry.ssr.tsx",
					},
					output: {
						inlineDynamicImports: true,
					},
				},
			},
		},
	},
	plugins: [
		rsc(),
		react(),
	],
	resolve: {
		alias: {
			$actions: path.resolve(__dirname, "./src/action.tsx"),
			$assets: path.resolve(__dirname, "./src/assets"),
			$components: path.resolve(__dirname, "./src/components"),
			$entity: path.resolve(__dirname, "./src/entity"),
			$lib: path.resolve(__dirname, "./src/lib"),
			$pages: path.resolve(__dirname, "./src/pages"),
			$styles: path.resolve(__dirname, "./src/styles"),
			$tmpimg: path.resolve(__dirname, "./public/images"),
			$utils: path.resolve(__dirname, "./src/utils"),
		},
	},
	server: { allowedHosts: ["testing.duti.dev"] },
});
