const {request} = require('gaxios');

async function run() {
    const res = await request({
        url: 'https://www.googleapis.com/discovery/v1/apis/',
    });
    console.log(res);
}

run();