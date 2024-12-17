### Install patches

```bash
npm run postinstall
```

```
❯ npm run postinstall

> patch-package-fun@1.0.0 postinstall
> patch-package

patch-package 8.0.0
Applying patches...
leftpad@0.0.1 ✔
```

### Apply patches

```bash
cat code.js > node_modules/leftpad/index.js
npx patch-package leftpad
```

Run the patch / app
```
./run.sh
```