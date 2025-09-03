export function resultNotNull() {
    // Works
    const str = "Hello";
    console.log(str);
    // TS Error
    //const invalid: InvalidString = null; // Error: Type 'null' is not assignable to type 'never'
    //console.log(invalid);
}
