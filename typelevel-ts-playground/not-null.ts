type NotNull<T> = T extends null | undefined ? never : T;

export function resultNotNull() {
    type ValidString = NotNull<string>;
    type InvalidString = NotNull<string | null | undefined>;

    // Works
    const str: ValidString = "Hello";
    console.log(str);

    // TS Error
    //const invalid: InvalidString = null; // Error: Type 'null' is not assignable to type 'never'
    //console.log(invalid);
}
