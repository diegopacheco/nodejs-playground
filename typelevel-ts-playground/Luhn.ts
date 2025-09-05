// Type-level implementation of the Luhn checksum for credit card style numbers.

// Digit character constraint
type DigitChar = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

// Map a single char to its numeric value (narrowed to Digit)
type CharToDigit<C extends DigitChar> =
  C extends "0" ? 0 :
  C extends "1" ? 1 :
  C extends "2" ? 2 :
  C extends "3" ? 3 :
  C extends "4" ? 4 :
  C extends "5" ? 5 :
  C extends "6" ? 6 :
  C extends "7" ? 7 :
  C extends "8" ? 8 :
  C extends "9" ? 9 :
  never;

// Build an array of length N (used for addition by length)
type BuildArray<N extends number, Acc extends any[] = []> =
  Acc["length"] extends N ? Acc : BuildArray<N, [unknown, ...Acc]>;

// String -> digits (skips spaces). Invalid chars => never.
type StringToDigits<
  S extends string,
  Acc extends Digit[] = [],
> = S extends `${infer C}${infer Rest}`
  ? C extends " " ? StringToDigits<Rest, Acc>
    : C extends DigitChar ? StringToDigits<Rest, [...Acc, CharToDigit<C>]>
    : never
  : Acc;

// Reverse a tuple
type Reverse<T extends any[], Acc extends any[] = []> =
  T extends [infer H, ...infer R] ? Reverse<R, [H, ...Acc]> : Acc;

// Luhn double transformation for a single digit using tuple indexing
// index = original digit, value = transformed digit
type LuhnDoubleMap = [0, 2, 4, 6, 8, 1, 3, 5, 7, 9];

// Toggle boolean
type Toggle<B extends boolean> = B extends true ? false : true;

// Sum builder: represents cumulative sum as an array (length = sum)
type LuhnAccum<
  Digits extends Digit[],
  ShouldDouble extends boolean = false,
  Sum extends any[] = [],
> = Digits extends [infer D extends Digit, ...infer Rest extends Digit[]]
  ? (
    ShouldDouble extends true
      ? LuhnAccum<
          Rest,
          Toggle<ShouldDouble>,
          [...Sum, ...BuildArray<LuhnDoubleMap[D]>]
        >
      : LuhnAccum<
          Rest,
          Toggle<ShouldDouble>,
          [...Sum, ...BuildArray<D>]
        >
  )
  : Sum;

// Mod 10 by repeatedly stripping 10 elements
type Mod10<A extends any[]> =
  A extends [any, any, any, any, any, any, any, any, any, any, ...infer Rest]
    ? Mod10<Rest>
    : A;

// Core Luhn validation over digit tuple
type IsLuhnDigits<D extends Digit[]> =
  // Reverse so index 0 is the original rightmost (check digit position)
  Mod10<LuhnAccum<Reverse<D>>> extends [] ? true : false;

// Public type: retains S only if it passes Luhn; else never.
export type Luhn<S extends string> =
  StringToDigits<S> extends infer Digits
    ? Digits extends Digit[]
      ? Digits extends [] ? never
        : IsLuhnDigits<Digits> extends true ? S : never
      : never
    : never;

type TValid1 = Luhn<"79927398713">;
type TValid2 = Luhn<"4111111111111111">;
type TValid3 = Luhn<"5555555555554444">;
type TValidWithSpaces = Luhn<"4111 1111 1111 1111">;
type TInvalid1 = Luhn<"79927398714">;
type TInvalid2 = Luhn<"4111111111111112">;
type TInvalidChars = Luhn<"4111-1111-1111-1111">;

export function resultsLuhn() {
  const v1: Luhn<"4111111111111111"> = "4111111111111111";
  const v2: Luhn<"79927398713"> = "79927398713";
  console.log("Valid Luhn samples:", v1, v2);

  // ts-expect-error (Uncomment to see the compile-time failure)
  // const bad: Luhn<"4111111111111112"> = "4111111111111112";
}