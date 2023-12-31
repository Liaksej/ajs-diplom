const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
  // Set the mode to development or production
  mode: "development",
  // Control how source maps are generated
  devtool: "source-map",

  // Spin up a server for quick development
  devServer: {
    historyApiFallback: true,
    open: true,
    compress: true,
    port: 9000,
    static: {
      directory: path.join(__dirname, "src"),
    },
    watchFiles: ["src/**/*.html"],
  },

  plugins: [],
});
