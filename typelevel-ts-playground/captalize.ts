type CapitalCase<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Rest}`
  : S;

export function resultsCapitalCase(){
    type Hello = CapitalCase<"hello">;
    type World = CapitalCase<"world">;
    
    // Works
    const hello: Hello = "Hello";
    const world: World = "World";
    console.log(hello);
    console.log(world);
    
    // Ts Errors
    //const wrongHello: Hello = "hello"; // Error: Type '"hello"' is not assignable to type '"Hello"'
    //const wrongWorld: World = "world"; // Error: Type '"world"' is not assignable to type '"World"'
    //console.log(wrongHello);
    //console.log(wrongWorld);
}