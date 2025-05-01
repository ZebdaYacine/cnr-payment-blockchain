import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
// import fs from "fs";
// import path from "path";

export default defineConfig({
  plugins: [react()],

  server: {
    // watch: {
    //   usePolling: true, // Forces file watching even in tricky setups
    // },
    // host: "0.0.0.0", //
    // https: {
    //     key: fs.readFileSync(
    //       path.resolve(__dirname, "../../backend/cert/cnr-key.pem")
    //     ),
    //     cert: fs.readFileSync(
    //       path.resolve(__dirname, "../../backend/cert/cnr.pem")
    //     ),
    //   },
    // host: "localhost",
    port: 5173,
  },
});
