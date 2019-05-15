const path = require("path");

module.exports = {
  entry: {
    app: "./src/app.js"
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "js/app.bundle.js"
  },
  devServer: {
    contentBase: path.resolve(__dirname, "build"),
    open: true
  },
  module: {
    rules: [{
      test: /\.js?$/,
      exclude: /node_modules/,
      loader: "babel-loader",
      query: {
        presets: ["env"]
      }
    },
    {
      test: /.*\.(gif|png|jpe?g)$/i,
      use: [
        {
          loader: 'file-loader'
        }
      ]
    }]
  },
  mode: "production"
};