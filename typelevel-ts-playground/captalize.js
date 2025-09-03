export function resultsCapitalCase() {
    // Works
    const hello = "Hello";
    const world = "World";
    console.log(hello);
    console.log(world);
    // Ts Errors
    //const wrongHello: Hello = "hello"; // Error: Type '"hello"' is not assignable to type '"Hello"'
    //const wrongWorld: World = "world"; // Error: Type '"world"' is not assignable to type '"World"'
    //console.log(wrongHello);
    //console.log(wrongWorld);
}
