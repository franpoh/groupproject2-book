//testing by g1

const winston = require("winston");

const logger = winston.createLogger({
    level:"info",
    format:winston.format.json(),
    transports:[
        new winston.transports.File({filename:process.env.LOG_PATH}),
        new winston.transports.Console({format: winston.format.simple()})
    ]
})

module.exports = logger;