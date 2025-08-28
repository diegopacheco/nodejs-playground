// Template literal types for advanced string manipulation

type CamelCase<S extends string> = S extends `${infer First}_${infer Rest}`
  ? `${First}${CamelCase<Capitalize<Rest>>}`
  : S;

type KebabCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? First extends Uppercase<First>
    ? `${Lowercase<First>}-${KebabCase<Rest>}`
    : `${First}${KebabCase<Rest>}`
  : S;

type SnakeCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? First extends Uppercase<First>
    ? `${Lowercase<First>}_${SnakeCase<Rest>}`
    : `${First}${SnakeCase<Rest>}`
  : S;

type Split<S extends string, D extends string> = S extends `${infer First}${D}${infer Rest}`
  ? [First, ...Split<Rest, D>]
  : [S];

type Replace<S extends string, From extends string, To extends string> = 
  S extends `${infer Before}${From}${infer After}`
    ? `${Before}${To}${Replace<After, From, To>}`
    : S;

type StartsWith<S extends string, Prefix extends string> = S extends `${Prefix}${string}` ? true : false;

type EndsWith<S extends string, Suffix extends string> = S extends `${string}${Suffix}` ? true : false;

type Trim<S extends string> = S extends ` ${infer Rest}`
  ? Trim<Rest>
  : S extends `${infer Rest} `
    ? Trim<Rest>
    : S;

type Length<S extends string> = Split<S, "">["length"];

type Reverse<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Reverse<Rest>}${First}`
  : "";

type URLBuilder<Base extends string, Path extends string, Params extends Record<string, string | number> = {}> =
  keyof Params extends never
    ? `${Base}${Path}`
    : `${Base}${Path}?${URLParams<Params>}`;

type URLParams<T extends Record<string, string | number>> = {
  [K in keyof T]: `${string & K}=${T[K]}`
}[keyof T] extends infer U
  ? U extends string
    ? Join<[U], "&">
    : never
  : never;

type Join<T extends readonly string[], Separator extends string> = T extends readonly [infer First, ...infer Rest]
  ? First extends string
    ? Rest extends readonly string[]
      ? Rest["length"] extends 0
        ? First
        : `${First}${Separator}${Join<Rest, Separator>}`
      : never
    : never
  : "";

// Usage examples
export function demonstrateStringManipulation() {
  // Case conversions
  type Snake = "user_first_name";
  type Camel = CamelCase<Snake>; // "userFirstName"
  type Kebab = KebabCase<"UserFirstName">; // "user-first-name"
  type SnakeCased = SnakeCase<"UserFirstName">; // "user_first_name"
  
  // String operations
  type Parts = Split<"a,b,c", ",">; // ["a", "b", "c"]
  type Replaced = Replace<"hello world hello", "hello", "hi">; // "hi world hi"
  
  // String predicates
  type StartsWithHello = StartsWith<"hello world", "hello">; // true
  type EndsWithWorld = EndsWith<"hello world", "world">; // true
  
  // String utilities
  type Trimmed = Trim<" hello world ">; // "hello world"
  type StringLength = Length<"hello">; // 5
  type Reversed = Reverse<"hello">; // "olleh"
  
  // URL building
  type API = URLBuilder<"https://api.com", "/users", { page: 1, limit: 10 }>; // "https://api.com/users?page=1&limit=10"
  
  console.log("String manipulation showcase completed");
}