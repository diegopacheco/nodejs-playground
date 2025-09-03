export function resultsExtract() {
    // Works
    const simplePath = ["users", "123", "posts"];
    const deepPath = ["api", "v1", "users", "456", "orders", "789"];
    console.log("Simple URL paths:", simplePath);
    console.log("Deep URL paths:", deepPath);
    // TS Error
    //const wrongPath: SimpleUrl = ["users", "123", "comments"]; // Error: Type '"comments"' is not assignable to type '"posts"'
    //console.log("Extract (invalid):", wrongPath);
}
