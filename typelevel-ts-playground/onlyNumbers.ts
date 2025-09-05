type OnlyNumbers<xs> = xs extends [infer head, ...infer tail]
    ? head extends number
        ? [head, ...OnlyNumbers<tail>]
        : OnlyNumbers<tail>
    : [];

type t = OnlyNumbers<[1, '2', 3, null, 4, undefined, 5, {}, 6]>; // expected to be [1, 3, 4, 5, 6]

export function resultOnlyNumbers(){
    const a: t = [1, 3, 4, 5, 6];
    console.log(a);
}
