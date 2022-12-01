//requiring this pacakge
const HtmlWebpackPlugin = require("html-webpack-plugin");
//requiring this pacakge
const WebpackPwaManifest = require("webpack-pwa-manifest");
//The Path module provides a way of working with directories and file paths.
const path = require("path");
//requiring inject manifest method from this plugin
const { InjectManifest } = require("workbox-webpack-plugin");

module.exports = () => {
  return {
    //setting development mode
    mode: "development",
    //entry are the main js files that our app uses
    entry: {
      main: "./src/js/index.js",
      install: "./src/js/install.js",
    },
    //output describes the bundle that webpack will build. it will create two bundes one each for main and install as shown in entry above and will put them is a folder called dist
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [
      //this plugin generates a minified html file for the dist folder
      new HtmlWebpackPlugin({
        template: "./index.html",
        title: "jate",
      }),
      //using inject manifest method from the webpack plugin to cache stuff
      new InjectManifest({
        swSrc: "./src-sw.js",
        swDest: "src-sw.js",
      }),
      //using webpack pwa manifest packagevto make a manifest for me so that the app can have a splash screen and be installable directly on the users device
      new WebpackPwaManifest({
        //browser fingerprinting is a tracking and identification method websites use to associate individual browsing sessions with one site visitor.
        fingerprints: false,
        inject: true,
        name: "text-editor",
        //short name is used if name is too long to be parsed
        short_name: "text",
        description: "enter your text notes",
        //The theme_color member is a string that defines the default theme color for the application.
        background_color: "#272822",
        theme_color: "#272822",
        // start url and public path is ./ meaning that it is the homepage url
        start_url: "./",
        publicPath: "./",
        //The icons member specifies an array of objects representing image files that can serve as application icons for different contexts.
        icons: [
          {
            src: path.resolve("src/images/logo.png"),
            //it resizes our logo image to an array of these different
            //sizes.
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join("assets", "icons"),
          },
        ],
      }),
    ],

    module: {
      rules: [
        //using css loader and style loader for including css files in the bundle.
        //test identifies whoch file(s) should be transformed and use indicates which loader should be used to transform it
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          //look for files ending in .js and convert them to es6
          test: /\.m?js$/,
          exclude: /node_modules/,
          //  use babel-loader in order to convert our ES6 code to ES5 so as to ensure all browsers can read it
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
              plugins: [
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/transform-runtime",
              ],
            },
          },
        },
      ],
    },
  };
};
