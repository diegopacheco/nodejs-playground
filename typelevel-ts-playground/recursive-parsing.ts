// Recursive type-level programming for complex data parsing

type ParseJSON<T extends string> = T extends `${infer L}${infer R}`
  ? L extends '"'
    ? ParseString<R>
    : L extends '{'
      ? ParseObject<R>
      : L extends '['
        ? ParseArray<R>
        : L extends 't'
          ? R extends `rue${infer Rest}` ? [true, Rest] : never
          : L extends 'f'
            ? R extends `alse${infer Rest}` ? [false, Rest] : never
            : L extends 'n'
              ? R extends `ull${infer Rest}` ? [null, Rest] : never
              : never
  : never;

type ParseString<T extends string, Acc extends string = ""> = T extends `"${infer Rest}`
  ? [Acc, Rest]
  : T extends `${infer Char}${infer Rest}`
    ? ParseString<Rest, `${Acc}${Char}`>
    : never;

type ParseObject<T extends string> = T extends `}${infer Rest}`
  ? [{}, Rest]
  : ParseObjectContent<T>;

type ParseObjectContent<T extends string> = T extends `"${infer Key}"${infer Rest}`
  ? Rest extends `:${infer ValueRest}`
    ? ParseJSON<ValueRest> extends [infer Value, infer Remaining]
      ? Remaining extends `,${infer NextRest}`
        ? ParseObjectContent<NextRest> extends [infer NextObj, infer FinalRest]
          ? [{ [K in Key]: Value } & NextObj, FinalRest]
          : never
        : Remaining extends `}${infer FinalRest}`
          ? [{ [K in Key]: Value }, FinalRest]
          : never
      : never
    : never
  : never;

type ParseArray<T extends string, Acc extends any[] = []> = T extends `]${infer Rest}`
  ? [Acc, Rest]
  : ParseJSON<T> extends [infer Value, infer Remaining]
    ? Remaining extends `,${infer NextRest}`
      ? ParseArray<NextRest, [...Acc, Value]>
      : Remaining extends `]${infer FinalRest}`
        ? [[...Acc, Value], FinalRest]
        : never
    : never;

type Length<T extends readonly any[]> = T extends readonly any[]
  ? T['length']
  : never;

type Reverse<T extends readonly any[]> = T extends readonly [...infer Rest, infer Last]
  ? [Last, ...Reverse<Rest>]
  : [];

type Join<T extends readonly string[], Separator extends string = ","> = T extends readonly [infer First, ...infer Rest]
  ? First extends string
    ? Rest extends readonly string[]
      ? Rest['length'] extends 0
        ? First
        : `${First}${Separator}${Join<Rest, Separator>}`
      : never
    : never
  : "";

type DeepFlat<T extends readonly any[]> = T extends readonly [infer First, ...infer Rest]
  ? First extends readonly any[]
    ? [...DeepFlat<First>, ...DeepFlat<Rest>]
    : [First, ...DeepFlat<Rest>]
  : [];

// Usage examples
export function demonstrateRecursiveParsing() {
  // Type-level JSON parsing
  type SimpleJSON = ParseJSON<'"hello"'>; // ["hello", ""]
  
  // Array operations
  type Numbers = [1, 2, 3, 4, 5];
  type ArrayLength = Length<Numbers>; // 5
  type ReversedNumbers = Reverse<Numbers>; // [5, 4, 3, 2, 1]
  
  // String operations
  type Words = ["hello", "world", "typescript"];
  type JoinedWords = Join<Words, " ">; // "hello world typescript"
  type JoinedWithCommas = Join<Words>; // "hello,world,typescript"
  
  // Nested array flattening
  type Nested = [[1, 2], [3, [4, 5]], 6];
  type Flattened = DeepFlat<Nested>; // [1, 2, 3, 4, 5, 6]
  
  console.log("Recursive parsing showcase completed");
}