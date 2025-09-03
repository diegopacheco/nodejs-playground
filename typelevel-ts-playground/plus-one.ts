type Plus1<T extends readonly number[]> = {
  readonly [K in keyof T]: T[K] extends number ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11][T[K]] : never;
};

export function resultsPlusOne(){
    type Original = [0, 1, 2, 5, 9];
    type Incremented = Plus1<[0, 1, 2, 5, 9]>; // [1, 2, 3, 6, 10]
    
    // Works
    const original: Original = [0, 1, 2, 5, 9];
    const incremented: Incremented = [1, 2, 3, 6, 10];
    
    console.log("Original:", original);
    console.log("Plus1:", incremented);

    // Does not work - ES errors
    //const invalid: Incremented = [1, 2, 3, 6, 11]; //Type '11' is not assignable to type '10'.ts(2322)
    //console.log("Plus1 (invalid):", invalid);
}