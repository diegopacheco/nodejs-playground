// Type-level implementation of the Luhn checksum for credit card style numbers.
export function resultsLuhn() {
    const v1 = "4111111111111111";
    const v2 = "79927398713";
    console.log("Valid Luhn samples:", v1, v2);
    // ts-expect-error (Uncomment to see the compile-time failure)
    // const bad: Luhn<"4111111111111112"> = "4111111111111112";
}
