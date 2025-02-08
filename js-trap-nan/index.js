function test(value){
    if (value){
        console.log("#1: if (value) : " + value);
    }
    if (value != null && value != undefined){
        console.log("#2: if (value != null && value != undefined) value: " + value);
    }
    if (parseInt(value) != null){
        console.log("#3: if (parseInt(value) != null) value: " + parseInt(value));
    }
    console.log("-----");
}

console.log("Node Version: " + process.version);
console.log("-----");
test("1,0042");
test("1.0042");

console.log("END.");