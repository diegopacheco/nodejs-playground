const oranges = ['orange', 'orange'];
oranges.forEach(fruit => {
  console.count(fruit);
});

const apples = ['just one apple'];
apples.forEach(fruit => {
  console.count(fruit);
});

console.trace();

const doSomething = () => console.log('test');
const measureDoingSomething = () => {
  console.time('doSomething()');
  doSomething();
  console.timeEnd('doSomething()');
};
measureDoingSomething();