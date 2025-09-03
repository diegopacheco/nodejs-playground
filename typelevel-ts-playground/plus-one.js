export function resultsPlusOne() {
    // Works
    const original = [0, 1, 2, 5, 9];
    const incremented = [1, 2, 3, 6, 10];
    console.log("Original:", original);
    console.log("Plus1:", incremented);
    // Does not work - ES errors
    //const invalid: Incremented = [1, 2, 3, 6, 11]; //Type '11' is not assignable to type '10'.ts(2322)
    //console.log("Plus1 (invalid):", invalid);
}
