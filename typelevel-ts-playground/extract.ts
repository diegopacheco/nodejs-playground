type ExtractPath<T extends string> = T extends `${string}://${string}/${infer Path}`
  ? Path extends `${infer First}/${infer Rest}`
    ? [First, ...ExtractPath<`https://example.com/${Rest}`>]
    : Path extends ""
    ? []
    : [Path]
  : [];

export function resultsExtract(){
    type SimpleUrl = ExtractPath<"https://api.example.com/users/123/posts">; // ["users", "123", "posts"]
    type DeepUrl = ExtractPath<"https://domain.com/api/v1/users/456/orders/789">; // ["api", "v1", "users", "456", "orders", "789"]
    
    // Works
    const simplePath: SimpleUrl = ["users", "123", "posts"];
    const deepPath: DeepUrl = ["api", "v1", "users", "456", "orders", "789"];
    
    console.log("Simple URL paths:", simplePath);
    console.log("Deep URL paths:", deepPath);
    
    // TS Error
    //const wrongPath: SimpleUrl = ["users", "123", "comments"]; // Error: Type '"comments"' is not assignable to type '"posts"'
    //console.log("Extract (invalid):", wrongPath);
}