function test(value){
    console.log("Test for [" + value + "]:");
    if (value){
        console.log("#1: if (value) : " + value);
    }else{
        console.log("#1: BAD");
    }

    if (value != null && value != undefined){
        console.log("#2: if (value != null && value != undefined) value: " + value);
    }else{
        console.log("#2: BAD");
    }

    if (parseInt(value) != null){
        console.log("#3: if (parseInt(value) != null) value: " + parseInt(value));
    }else{
        console.log("#3: BAD");
    }

    if (value >= 0){
        console.log("#4: if (value >= 0) value: " + value);
    }else{
        console.log("#4: BAD: " + (value >= 0));
    }

    if (parseInt(value) >= 0){
        console.log("#5: if (parseInt(value) >= 0) value: " + value);
    }else{
        console.log("#5: BAD: " + (parseInt(value) >= 0));
    }

    if (typeof value === 'number' && value >= 0){
        console.log("#6: typeof value === 'number' && value >= 0 value: " + value);
    }else{
        console.log("#6: BAD: " + value);
    }

    console.log("-----");
}

console.log("Node Version: " + process.version);
console.log("-----");
test("1,0042");
test("1.0042");
test(null);
test(undefined);
test("");

console.log("END.");