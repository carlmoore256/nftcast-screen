import legacy from "@vitejs/plugin-legacy";
import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import babel from "vite-plugin-babel";
import { readFileSync } from "fs";

const env = loadEnv("all", process.cwd());

if (env.VITE_LOCAL_DEV) {
  console.log("Local dev mode enabled");
}
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        svelte(),
        legacy({
            targets: ["Firefox > 20"],
        }),
    ],
    build: {
        minify: false,
    },
    server: {
        port: 5173,
        https: {
            key: readFileSync(env.VITE_SSL_KEY),
            cert: readFileSync(env.VITE_SSL_CERT),
        },
    },
});
