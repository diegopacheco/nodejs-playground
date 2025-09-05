// Demonstrates type-level representation and manipulation of functions
// - Function type extraction (Parameters, ReturnType)
// - Currying transformation
// - Composition typing
// - Pipelining inference

// Extract the Nth parameter from a function type
export type NthArg<F, N extends number, P = F extends (...args: infer A) => any ? A : never> =
  P extends readonly any[] ? (P[N] extends undefined ? never : P[N]) : never;

// Build a curried version of a function (simple version: unary chain)
export type Curry<F> = F extends (a: infer A, ...rest: infer R) => infer Ret
  ? R['length'] extends 0
    ? (a: A) => Ret
    : (a: A) => Curry<(...r: R) => Ret>
  : never;

// Compose two unary functions (right-to-left)
export type Compose<A, B> = A extends (x: infer XA) => infer RA
  ? B extends (y: RA) => infer RB
    ? (x: XA) => RB
    : never
  : never;

// Helper to grab the last element of a tuple
type Last<T extends readonly any[]> = T extends readonly [...any[], infer L] ? L : never;

// Simplified variadic pipeline type: input is first fn arg, output is last fn return
// (Does not recursively validate intermediate compatibility to avoid deep instantiation.)
export type Pipe<Fns extends readonly [ (arg: any) => any, ...((arg: any) => any)[] ]> =
  Last<Fns> extends (arg: any) => any
    ? (arg: Parameters<Fns[0]>[0]) => ReturnType<Last<Fns>>
    : never;

// Implementation helpers for runtime demonstration
const compose = <A, B, C>(ab: (a: A) => B, bc: (b: B) => C) => (a: A): C => bc(ab(a));

// Curry runtime (simple)
function curry<F extends (...args: any[]) => any>(fn: F): any {
  return function curried(this: any, ...args: any[]): any {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return (...rest: any[]) => curried.apply(this, [...args, ...rest]);
  };
}

export function resultsFunc(){
  // Base function
  function add(a: number, b: number, c: number): number { return a + b + c; }

  // Type-Level: extract args & return
  type AddParams = Parameters<typeof add>; // [number, number, number]
  type AddReturn = ReturnType<typeof add>; // number
  type SecondArg = NthArg<typeof add, 1>; // number

  // Curry type demonstration
  type CurriedAdd = Curry<typeof add>;
  const cAdd: CurriedAdd = (a: number) => (b: number) => (c: number) => add(a,b,c);
  const curriedResult = cAdd(1)(2)(3); // 6

  // Compose two unary functions
  const double = (n: number) => n * 2;
  const toString = (n: number) => `#${n}`;
  const doubleThenString = compose(double, toString);
  const composed = doubleThenString(21); // '#42'

  // Pipeline inference example (static check)
  type Pipeline = Pipe<[
    (x: string) => number,
    (y: number) => boolean,
    (z: boolean) => { ok: boolean }
  ]>;
  // Pipeline should be (x: string) => { ok: boolean }
  const pipeline: Pipeline = (s: string) => ({ ok: !!s.length });
  const pipelineResult = pipeline("hello");

  console.log("Function Type Introspection and Transformations:");
  console.log("  Parameters<typeof add> =>", JSON.stringify([1,2,3] as AddParams));
  console.log("  ReturnType<typeof add> =>", ((): AddReturn => 42)());
  console.log("  NthArg<typeof add,1> is number?", typeof (0 as SecondArg) === 'number');
  console.log("  Curried add 1)(2)(3) =>", curriedResult);
  console.log("  Composed double->toString 21 =>", composed);
  console.log("  Pipeline('hello') =>", pipelineResult);

  // Intentional TS error samples (kept commented)
  // const wrongSecond: SecondArg = 'nope';
  // const badPipeline: Pipeline = (n: number) => ({ ok: true });
}
