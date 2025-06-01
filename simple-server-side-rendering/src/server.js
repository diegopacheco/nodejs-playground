const http = require('http');
const port = 3000;

class LRUCache {
  constructor(limit = 5) {
    this.cache = new Map();
    this.limit = limit;
  }
  get(key) {
    if (!this.cache.has(key)) return null;
    const value = this.cache.get(key);
    this.cache.delete(key);      
    this.cache.set(key, value);
    return value;
  }
  set(key, value) {
    if (this.cache.has(key)) {
        this.cache.delete(key);
    }
    else if (this.cache.size >= this.limit) {
      const oldest = this.cache.keys().next().value;
      this.cache.delete(oldest);
    }
    this.cache.set(key, value);
  }
}

const htmlCache = new LRUCache();

function renderHTML(name) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>SSR+LRU</title>
    </head>
    <body>
      <h1>Hello, ${name}!</h1>
      <p>Cached HTML.</p>
      <footer><small>${new Date().toISOString()}</small></footer>
    </body>
    </html>
  `;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const name = url.searchParams.get("name") || "World";
  const cacheKey = name.toLowerCase();
  let html = htmlCache.get(cacheKey);
  if (!html) {
    html = renderHTML(name);
    htmlCache.set(cacheKey, html);
    console.log(`Rendered and cached for "${name}"`);
  } else {
    console.log(`Cache hit for "${name}"`);
  }
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
});

server.listen(port, () => {
  console.log(`Server with LRU cache running at http://localhost:${port}/`);
});