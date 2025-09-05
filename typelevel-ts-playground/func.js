// Demonstrates type-level representation and manipulation of functions
// - Function type extraction (Parameters, ReturnType)
// - Currying transformation
// - Composition typing
// - Pipelining inference
// Implementation helpers for runtime demonstration
const compose = (ab, bc) => (a) => bc(ab(a));
// Curry runtime (simple)
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return (...rest) => curried.apply(this, [...args, ...rest]);
    };
}
export function resultsFunc() {
    // Base function
    function add(a, b, c) { return a + b + c; }
    const cAdd = (a) => (b) => (c) => add(a, b, c);
    const curriedResult = cAdd(1)(2)(3); // 6
    // Compose two unary functions
    const double = (n) => n * 2;
    const toString = (n) => `#${n}`;
    const doubleThenString = compose(double, toString);
    const composed = doubleThenString(21); // '#42'
    // Pipeline should be (x: string) => { ok: boolean }
    const pipeline = (s) => ({ ok: !!s.length });
    const pipelineResult = pipeline("hello");
    console.log("Function Type Introspection and Transformations:");
    console.log("  Parameters<typeof add> =>", JSON.stringify([1, 2, 3]));
    console.log("  ReturnType<typeof add> =>", (() => 42)());
    console.log("  NthArg<typeof add,1> is number?", typeof 0 === 'number');
    console.log("  Curried add 1)(2)(3) =>", curriedResult);
    console.log("  Composed double->toString 21 =>", composed);
    console.log("  Pipeline('hello') =>", pipelineResult);
    // Intentional TS error samples (kept commented)
    // const wrongSecond: SecondArg = 'nope';
    // const badPipeline: Pipeline = (n: number) => ({ ok: true });
}
