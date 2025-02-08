function test(value){
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
    console.log("-----");
}

console.log("Node Version: " + process.version);
console.log("-----");
test("1,0042");
test("1.0042");

console.log("END.");