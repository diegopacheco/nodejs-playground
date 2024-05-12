const kvjs = require('@heyputer/kv.js');

// Create a new kv.js instance
const kv = new kvjs();
console.log(kv);

// Set a key
console.log(kv.set('foo', 'bar'));

// Get the key's value
console.log(kv.get('foo')); // "bar"

// Delete the key
console.log(kv.del('foo'));

// Set another key
console.log(kv.set('username', 'heyputer'));

// Automatically delete the key after 60 seconds
console.log(kv.expire('username', 60));