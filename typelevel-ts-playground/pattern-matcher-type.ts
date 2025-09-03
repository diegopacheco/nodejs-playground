type Plus18<N extends number> = N extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17
  ? never 
  : N;

export function resultsPlus18(){
    type ValidAge = Plus18<25>;
    type InvalidAge = Plus18<16>;
    
    // Works
    const adult: ValidAge = 25;
    console.log(adult);
    
    // TS Error
    //const minor: InvalidAge = 16; // Error: Type '16' is not assignable to type 'never'
    //console.log(minor);
}