const express = require('express');
const fs = require('fs');
const path = require('path');
const { transform, browserslistToTargets } = require('lightningcss');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.get('/styles.css', (req, res) => {
  try {
    const cssPath = path.join(__dirname, 'src', 'styles.css');
    const css = fs.readFileSync(cssPath, 'utf8');
    
    const result = transform({
      code: Buffer.from(css),
      minify: true,
      targets: browserslistToTargets([
        'last 2 versions',
        '> 1%',
        'not dead'
      ]),
      drafts: {
        customMedia: true,
      },
    });
    
    res.setHeader('Content-Type', 'text/css');
    res.send(result.code.toString());
  } catch (error) {
    console.error('Error processing CSS:', error);
    res.status(500).send('Error processing CSS');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('CSS is being processed with LightningCSS on every request');
});