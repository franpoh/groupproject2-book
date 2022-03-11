//testing by g1

const winston = require("winston");

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize(),
        winston.format.timestamp({ format: "YYYY-MM-DDTHH:mm:ss" }),
    ),
    transports: [
        new winston.transports.File({ filename: 'info.log' }),
        new winston.transports.Console()
    ]
})

module.exports = logger;