/// <reference path="../node_modules/webpack-dev-server/types/lib/Server.d.ts"/>
import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import { constFalse, pipe } from "fp-ts/function";
import HtmlPlugin from "html-webpack-plugin";
import ReactRefreshTypeScript from "react-refresh-typescript";
import { Configuration, DefinePlugin } from "webpack";

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
            <meta charset="utf-8"><title>Hrdwr Monitor</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="description" content="Polls PC hardware sensor data and display them through a cool looking dashboard" />
            <meta property="og:title" content="Hrdwr Monitor" />
            <meta property="og:url" content="https://hrdwr-monitor.netlify.app" />
            <meta property="og:image" content="https://tlbvr.com/static/hrdwr-screenshot1-5d41e9cacb6d26d9a73627a478bfb7c9.png" />
          </head>
          <body>
            <div id="app" />
          </body>
        </html>
      `,
    }),

    new DefinePlugin({
      __DEMO__: pipe(
        process.env,
        R.lookup("DEMO"),
        O.chain(O.fromNullable),
        O.match(constFalse, (x) => x === "true")
      ),
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
