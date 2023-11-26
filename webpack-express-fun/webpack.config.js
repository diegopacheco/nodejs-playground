const path = require('path')
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  optimization: {
    usedExports: true,
  },
  plugins: [new CompressionPlugin()],
  mode: 'production',
  externals: [
    function(context, request, callback) {
      if(request[0] == '.') {
        callback();
      } else {
        callback(null, "require('" + request + "')");
      }
    }
  ],
  entry: [ './src/index.js' ],
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, './dist')
  }
}