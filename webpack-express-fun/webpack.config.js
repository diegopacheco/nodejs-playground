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
    minimize: true,
    minimizer: [
      (compiler) => {
        const TerserPlugin = require('terser-webpack-plugin');
        new TerserPlugin({
          terserOptions: {
            compress: {},
          }
        }).apply(compiler);
      },
    ]
  },
  plugins: [new CompressionPlugin({
    test: /\.js(\?.*)?$/i,
    //algorithm: "gzip",
    algorithm: "brotliCompress",
  })],
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