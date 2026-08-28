import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [deno(), solid()],
  base: "/grphcl/"
});
