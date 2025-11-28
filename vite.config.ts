import path from "node:path";
import react from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import { defineConfig } from "vite";

export default defineConfig({
	// specify entry point for each environment.
	// (currently the plugin assumes `rollupOptions.input.index` for some features.)
	environments: {
		// client environment is used for hydration and client-side rendering
		// this environment is responsible for:
		// - RSC stream deserialization (RSC stream -> React VDOM)
		// - traditional CSR (React VDOM -> Browser DOM tree mount/hydration)
		// - refetch and re-render RSC
		// - calling server functions
		client: {
			build: {
				rollupOptions: {
					input: {
						index: "./src/framework/entry.browser.tsx",
					},
				},
			},
		},
		// `rsc` environment loads modules with `react-server` condition.
		// this environment is responsible for:
		// - RSC stream serialization (React VDOM -> RSC stream)
		// - server functions handling
		rsc: {
			build: {
				rollupOptions: {
					input: {
						index: "./src/framework/entry.rsc.tsx",
					},
				},
			},
		},

		// `ssr` environment loads modules without `react-server` condition.
		// this environment is responsible for:
		// - RSC stream deserialization (RSC stream -> React VDOM)
		// - traditional SSR (React VDOM -> HTML string/stream)
		ssr: {
			build: {
				rollupOptions: {
					input: {
						index: "./src/framework/entry.ssr.tsx",
					},
				},
			},
		},
	},
	plugins: [
		rsc({
			// `entries` option is only a shorthand for specifying each `rollupOptions.input` below
			// > entries: { rsc, ssr, client },
			//
			// by default, the plugin setup request handler based on `default export` of `rsc` environment `rollupOptions.input.index`.
			// This can be disabled when setting up own server handler e.g. `@cloudflare/vite-plugin`.
			// > serverHandler: false
		}),

		// use any of react plugins https://github.com/vitejs/vite-plugin-react
		// to enable client component HMR
		react(),

		// use https://github.com/antfu-collective/vite-plugin-inspect
		// to understand internal transforms required for RSC.
		// import("vite-plugin-inspect").then(m => m.default()),
	],
	resolve: {
		alias: {
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
