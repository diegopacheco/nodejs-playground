var bunyan = require('bunyan');
var log = bunyan.createLogger({name: "nodejs_21_app"});

log.info("hi");
log.info({
  "object_type": "spaguetti",
  "licky": 42,
});
log.info(new Error);