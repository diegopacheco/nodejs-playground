### Run

```bash
npx knip --config knip.json
```

```
❯ npx knip --config knip.json

✂️  Excellent, Knip found no issues.
```

Them I added react types to the dev dependencies.

```bash
npm i @types/react
```

Run again: 
```
❯ npx knip --config knip.json
Unused dependencies (1)
@types/react  package.json:15:6
```