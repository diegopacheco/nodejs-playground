## Without compression
```bash
npm run build
```
```
> webpack-express-fun@1.0.0 build
> webpack --config webpack.config.js

(node:796379) [DEP_WEBPACK_EXTERNALS_FUNCTION_PARAMETERS] DeprecationWarning: The externals-function should be defined like ({context, request}, cb) => { ... }
(Use `node --trace-deprecation ...` to show where the warning was created)
asset app.js 497 bytes [compared for emit] [minimized] (name: main)
./src/index.js 320 bytes [built] [code generated]
external "require('express')" 42 bytes [built] [code generated]
external "require('path')" 42 bytes [built] [code generated]
external "require('lodash')" 42 bytes [built] [code generated]
webpack 5.89.0 compiled successfully in 210 ms
```

## With compression
```bash
npm run build
```
```
> webpack-express-fun@1.0.0 build
> webpack --config webpack.config.js

(node:797019) [DEP_WEBPACK_EXTERNALS_FUNCTION_PARAMETERS] DeprecationWarning: The externals-function should be defined like ({context, request}, cb) => { ... }
(Use `node --trace-deprecation ...` to show where the warning was created)
asset app.js 497 bytes [compared for emit] [minimized] (name: main) 1 related asset
./src/index.js 320 bytes [built] [code generated]
external "require('express')" 42 bytes [built] [code generated]
external "require('path')" 42 bytes [built] [code generated]
external "require('lodash')" 42 bytes [built] [code generated]
webpack 5.89.0 compiled successfully in 206 ms
```