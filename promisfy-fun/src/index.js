function perfectSquare (number, callback) {
    const bool = Number.isInteger(Math.sqrt(number))
    if (!bool) {
        return callback(`Number ${number} is NOT a perfect square` )
    }
    callback(`Number ${number} is a perfect square`)
};

function callback(data){
   console.log("Callback result data is: " + data);
}

perfectSquare(25, callback);

const util = require("util");
let promiseCall = util.promisify(perfectSquare);

promiseCall(5).then(res => {
    console.log("promisify result: " + res);
}).catch(err => {
    console.log(err);
});