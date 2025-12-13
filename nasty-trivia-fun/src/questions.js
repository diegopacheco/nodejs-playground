const questions = [
  {
    id: 1,
    code: `console.log(typeof typeof 1);`,
    options: ["number", "string", "undefined", "object"],
    correct: 1
  },
  {
    id: 2,
    code: `console.log(0.1 + 0.2 === 0.3);`,
    options: ["true", "false", "undefined", "NaN"],
    correct: 1
  },
  {
    id: 3,
    code: `console.log([] == ![]);`,
    options: ["true", "false", "TypeError", "undefined"],
    correct: 0
  },
  {
    id: 4,
    code: `console.log(+"");`,
    options: ["0", "NaN", "undefined", '""'],
    correct: 0
  },
  {
    id: 5,
    code: `console.log(null == undefined);`,
    options: ["true", "false", "TypeError", "null"],
    correct: 0
  },
  {
    id: 6,
    code: `console.log(null === undefined);`,
    options: ["true", "false", "TypeError", "null"],
    correct: 1
  },
  {
    id: 7,
    code: `console.log(typeof NaN);`,
    options: ["NaN", "undefined", "number", "object"],
    correct: 2
  },
  {
    id: 8,
    code: `console.log(NaN === NaN);`,
    options: ["true", "false", "NaN", "undefined"],
    correct: 1
  },
  {
    id: 9,
    code: `console.log([1, 2, 3] + [4, 5, 6]);`,
    options: ["[1,2,3,4,5,6]", "1,2,34,5,6", "[1, 2, 3, 4, 5, 6]", "NaN"],
    correct: 1
  },
  {
    id: 10,
    code: `console.log([] + {});`,
    options: ["[object Object]", "{}", "[]", "NaN"],
    correct: 0
  },
  {
    id: 11,
    code: `console.log({} + []);`,
    options: ["[object Object]", "0", "{}", "NaN"],
    correct: 0
  },
  {
    id: 12,
    code: `console.log(true + true + true);`,
    options: ["3", "true", "truetruetrue", "NaN"],
    correct: 0
  },
  {
    id: 13,
    code: `console.log("5" - 3);`,
    options: ["2", "53", "NaN", '"2"'],
    correct: 0
  },
  {
    id: 14,
    code: `console.log("5" + 3);`,
    options: ["8", "53", "NaN", "undefined"],
    correct: 1
  },
  {
    id: 15,
    code: `console.log(1 < 2 < 3);`,
    options: ["true", "false", "undefined", "TypeError"],
    correct: 0
  },
  {
    id: 16,
    code: `console.log(3 > 2 > 1);`,
    options: ["true", "false", "undefined", "TypeError"],
    correct: 1
  },
  {
    id: 17,
    code: `console.log(typeof null);`,
    options: ["null", "undefined", "object", "boolean"],
    correct: 2
  },
  {
    id: 18,
    code: `let a = [1, 2, 3];
let b = [1, 2, 3];
console.log(a == b);`,
    options: ["true", "false", "undefined", "TypeError"],
    correct: 1
  },
  {
    id: 19,
    code: `console.log(!!"false" == !!"true");`,
    options: ["true", "false", "undefined", "TypeError"],
    correct: 0
  },
  {
    id: 20,
    code: `console.log(parseInt("08"));`,
    options: ["0", "8", "NaN", "undefined"],
    correct: 1
  },
  {
    id: 21,
    code: `console.log(Math.max());`,
    options: ["0", "Infinity", "-Infinity", "undefined"],
    correct: 2
  },
  {
    id: 22,
    code: `console.log(Math.min());`,
    options: ["0", "Infinity", "-Infinity", "undefined"],
    correct: 1
  },
  {
    id: 23,
    code: `console.log([10, 2, 1].sort());`,
    options: ["[1, 2, 10]", "[10, 2, 1]", "[1, 10, 2]", "[2, 1, 10]"],
    correct: 2
  },
  {
    id: 24,
    code: `console.log(typeof []);`,
    options: ["array", "object", "undefined", "Array"],
    correct: 1
  },
  {
    id: 25,
    code: `console.log([] == false);`,
    options: ["true", "false", "TypeError", "undefined"],
    correct: 0
  },
  {
    id: 26,
    code: `console.log("" == false);`,
    options: ["true", "false", "TypeError", "undefined"],
    correct: 0
  },
  {
    id: 27,
    code: `console.log([] == 0);`,
    options: ["true", "false", "TypeError", "NaN"],
    correct: 0
  },
  {
    id: 28,
    code: `const foo = () => arguments;
console.log(typeof foo());`,
    options: ["object", "undefined", "ReferenceError", "function"],
    correct: 2
  },
  {
    id: 29,
    code: `console.log(0 == "0");`,
    options: ["true", "false", "TypeError", "NaN"],
    correct: 0
  },
  {
    id: 30,
    code: `console.log(0 == []);`,
    options: ["true", "false", "TypeError", "NaN"],
    correct: 0
  },
  {
    id: 31,
    code: `console.log("0" == []);`,
    options: ["true", "false", "TypeError", "NaN"],
    correct: 1
  },
  {
    id: 32,
    code: `let x = 10;
let y = (x++, x);
console.log(y);`,
    options: ["10", "11", "undefined", "NaN"],
    correct: 1
  },
  {
    id: 33,
    code: `console.log(1 + - + + + - + 1);`,
    options: ["0", "2", "NaN", "TypeError"],
    correct: 1
  },
  {
    id: 34,
    code: `console.log(!!null);`,
    options: ["true", "false", "null", "undefined"],
    correct: 1
  },
  {
    id: 35,
    code: `console.log(!!undefined);`,
    options: ["true", "false", "undefined", "TypeError"],
    correct: 1
  },
  {
    id: 36,
    code: `console.log(typeof Infinity);`,
    options: ["infinity", "number", "undefined", "Infinity"],
    correct: 1
  },
  {
    id: 37,
    code: `console.log(2 ** 3 ** 2);`,
    options: ["64", "512", "6", "81"],
    correct: 1
  },
  {
    id: 38,
    code: `console.log([...[..."hi"]]);`,
    options: ['["h", "i"]', '["hi"]', '"hi"', "TypeError"],
    correct: 0
  },
  {
    id: 39,
    code: `console.log(Number.isNaN("NaN"));`,
    options: ["true", "false", "NaN", "undefined"],
    correct: 1
  },
  {
    id: 40,
    code: `console.log(isNaN("NaN"));`,
    options: ["true", "false", "NaN", "undefined"],
    correct: 0
  },
  {
    id: 41,
    code: `console.log("b" + "a" + +"a" + "a");`,
    options: ["baaaa", "ba1a", "baNaNa", "TypeError"],
    correct: 2
  },
  {
    id: 42,
    code: `console.log(!+[]+""+![]);`,
    options: ["truefalse", "falsetrue", "true", "false"],
    correct: 0
  },
  {
    id: 43,
    code: `console.log(9999999999999999);`,
    options: ["9999999999999999", "10000000000000000", "Infinity", "NaN"],
    correct: 1
  },
  {
    id: 44,
    code: `console.log(0.5 | 0);`,
    options: ["0.5", "0", "1", "NaN"],
    correct: 1
  },
  {
    id: 45,
    code: `console.log(~~3.14);`,
    options: ["3.14", "3", "4", "NaN"],
    correct: 1
  },
  {
    id: 46,
    code: `console.log([] + null + 1);`,
    options: ["null1", "1", "[null1]", "NaN"],
    correct: 0
  },
  {
    id: 47,
    code: `console.log("foo".split("").reverse().join(""));`,
    options: ['"foo"', '"oof"', '["o","o","f"]', "TypeError"],
    correct: 1
  },
  {
    id: 48,
    code: `console.log(Array(3) == ",,"  );`,
    options: ["true", "false", "undefined", "TypeError"],
    correct: 0
  },
  {
    id: 49,
    code: `console.log(++[[]][+[]]+[+[]]);`,
    options: ["10", "11", "01", "00"],
    correct: 0
  },
  {
    id: 50,
    code: `console.log(Number([]));`,
    options: ["NaN", "0", "undefined", '""'],
    correct: 1
  }
];

export default questions;
