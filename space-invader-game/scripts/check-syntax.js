const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = process.argv[2];
const files = fs.readdirSync(root).filter(f => f.endsWith('.html') || f.endsWith('.js'));
let failed = 0;

for (const f of files) {
  const text = fs.readFileSync(path.join(root, f), 'utf8');
  const blocks = f.endsWith('.js') ? [text] : [...text.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  blocks.forEach((code, i) => {
    try {
      new vm.Script(code, { filename: f + '#' + i });
      console.log('ok   ' + f + ' block ' + i);
    } catch (e) {
      failed++;
      console.error('FAIL ' + f + ' block ' + i + ': ' + e.message);
    }
  });
}

process.exit(failed ? 1 : 0);
