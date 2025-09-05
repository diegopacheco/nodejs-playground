type IF<A extends boolean, B, C> = A extends true ? B : C;
type t = IF<true, string, number>; // string 

export function resultsIF(){
    const a: t = "true string :-)";
    console.log(a);
}
