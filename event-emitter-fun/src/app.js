const { EventEmitter } = require("events");

//
// Functional Style
//

const logEmitter = new EventEmitter();

const ON  = Symbol("ON");
const OFF = Symbol("OFF");

logEmitter.on(ON, () => {
    console.log("Someone just turn it ON");
});

logEmitter.on(OFF, () => {
    console.log("Someone just turn it OFF");
});

logEmitter.emit(ON);
logEmitter.emit(ON);
logEmitter.emit(ON);
logEmitter.emit(OFF);

//
// Using Classes
//

class StockManager extends EventEmitter {
    constructor(symbl) {
        super();
        this.symbl = symbl;
        this.value = 0;
    }
    up(price) {
        this.value=price;
        this.emit("up", price,this.symbl,this.value,Date.now());
    }
}

const sme = new StockManager("NTFX");

sme.on("up", (price,symbl,value,tms) => {
    console.log(`Stock ${symbl} got up to ${price} now ${tms}`);
});

sme.up(2);
sme.up(20);
sme.up(200);