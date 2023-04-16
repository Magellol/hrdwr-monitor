/// <reference path="../node_modules/webpack-dev-server/types/lib/Server.d.ts"/>
import type { Configuration } from "webpack";
import HtmlPlugin from "html-webpack-plugin";
import ReactRefreshTypeScript from "react-refresh-typescript";
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";

import { resolve } from "path";

const { NODE_ENV } = process.env;

const config: Configuration = {
  mode: NODE_ENV === "production" ? "production" : "development",
  entry: "./client/index.tsx",
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
              modules: {
                localIdentName: "[name]__[local]--[hash:base64:5]",
              },
            },
          },
        ],
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
            getCustomTransformers: () => ({
              before:
                NODE_ENV === "development" ? ReactRefreshTypeScript({}) : [],
            }),
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    alias: {
      // __dirname is the compiled dist/webpack folder, then we step out twice to get back to the codebase root.
      facades: resolve(__dirname, "..", "..", "client", "facades"),
    },
  },
  output: {
    filename: "app.js",
    // __dirname is related to `webpack/dist` so we have two go two levels backwards
    path: resolve(__dirname, "..", "..", "dist"),
  },
  plugins: [
    new HtmlPlugin({
      templateContent: `
      <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8"><title>Webpack App</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body>
            <div id="app" />
          </body>
        </html>
      `,
    }),
  ],
  devServer: {
    hot: true,
    port: 3000,
  },
};

if (NODE_ENV === "development") {
  config.plugins?.push(new ReactRefreshWebpackPlugin());
}

export default config;
