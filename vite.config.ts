import legacy from "@vitejs/plugin-legacy";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import babel from "vite-plugin-babel";
import { readFileSync } from "fs";

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
            key: readFileSync("E:/SSL/localhost-key.pem"),
            cert: readFileSync("E:/SSL/localhost-cert.pem"),
        },
    },
});
