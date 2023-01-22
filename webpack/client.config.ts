import type { Configuration } from "webpack";
import HtmlPlugin from "html-webpack-plugin";
import { resolve } from "path";

const config: Configuration = {
  mode: "development",
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: true,
            },
          },
        ],
      },
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
    publicPath: "/a/",

    // __dirname is related to `webpack/dist` so we have two go two levels backwards
    path: resolve(__dirname, "..", "..", "dist"),
  },
  plugins: [
    new HtmlPlugin({
      templateContent:
        '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Webpack App</title> <meta name="viewport" content="width=device-width, initial-scale=1"></head><body><div id="app" /></body></html>',
    }),
  ],
};

export default config;
