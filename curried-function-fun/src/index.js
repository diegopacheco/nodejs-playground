/**
 * curried on line 8 works because it uses the stack recursion to build the missing params.
 **/
function curry(fn){
  return function curried(...args){
    if (args.length === fn.length){
       return fn(...args);
    }else{
       return function (...newArgs){
          return curried(...args, ...newArgs);
       }
    }
  }
}

function sum(a,b,c){
  return a+b+c;
}

const csum = curry(sum);
console.log(csum(1));
console.log(csum(1)(2));
console.log(csum(1)(1)(1));
console.log(csum(1,2,3));
