import path from "path";
import { fileURLToPath } from 'url';

import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "production", // switch to "development" while coding
  entry: {
    main: "./client/src/index.jsx"
  },
  output: {
    path: path.resolve(__dirname, "client/dist"),
    filename: "[name].[contenthash].js",     // cache-busting
    chunkFilename: "[name].[contenthash].js", // for lazy-loaded chunks
    clean: true, // wipe dist/ before new build
    publicPath: "/" // ensures correct asset paths
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./client/public/index.html",
      inject: "body"
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "client/public/**/*",
          to: "client/dist",
          filter: async (resourcePath) => {
            if (resourcePath.endsWith('.html')) {
              return false;
            }
            return true;
          }
        }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpe?g|gif|svg|mp4|mp3|woff2?|eot|ttf)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/[hash][ext][query]"
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  optimization: {
    splitChunks: {
      chunks: "all", // vendor & commons split
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    },
    runtimeChunk: "single" // separates runtime into its own file
  },
  devServer: {
    static: path.join(__dirname, "client/public"),
    historyApiFallback: true, // for SPA routing
    compress: true,
    port: 4000,
    hot: true
  }
};