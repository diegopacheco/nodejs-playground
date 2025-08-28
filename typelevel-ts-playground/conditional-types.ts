// Type-level conditional logic using conditional types

type IsString<T> = T extends string ? true : false;

type StringOrNumber<T> = T extends string 
  ? `String: ${T}` 
  : T extends number 
    ? `Number: ${T}` 
    : 'Unknown type';

type NonNullable<T> = T extends null | undefined ? never : T;

type FunctionReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export function demonstrateConditionalTypes() {
  type Test1 = IsString<"hello">; // true
  type Test2 = IsString<42>; // false
  
  // Type-level string manipulation
  type Test3 = StringOrNumber<"world">; // "String: world"
  type Test4 = StringOrNumber<123>; // "Number: 123"
  
  // Filtering out null/undefined
  type Test5 = NonNullable<string | null>; // string
  
  // Extracting function return types
  const fn = () => ({ x: 1, y: 2 });
  type Test6 = FunctionReturnType<typeof fn>; // { x: number; y: number }
  
  // Deep readonly transformation
  type Test7 = DeepReadonly<{
    a: string;
    b: { c: number; d: { e: boolean } };
  }>; // All properties become deeply readonly
  
  console.log("Conditional types showcase completed");
}