// const path = require("path");
import type { Configuration } from "webpack";
import { resolve } from "path";

const config: Configuration = {
  mode: "development",
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "app.js",

    // __dirname is related to `webpack/dist` so we have two go two levels backwards
    path: resolve(__dirname, '..', '..', "dist"),
  },
};

export default config;
