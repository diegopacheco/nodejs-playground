var path = require('path')

module.exports = {
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  mode: 'development',
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