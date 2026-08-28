import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [deno(), solid()],
  base: "/grphcl/",
  resolve: {
    alias: {
      "jsr:@bowers/mthmtcl": "https://esm.jsr.io/@bowers/mthmtcl@0.0.1",
    },
  },
});
