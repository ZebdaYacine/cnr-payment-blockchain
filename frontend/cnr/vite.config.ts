import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync("./src/cert/cnr-key.pem"),
      cert: fs.readFileSync("./src/cert/cnr.pem"),
    },
    host: "localhost",
    port: 5173,
  },
});
