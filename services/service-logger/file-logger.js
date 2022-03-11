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
        new winston.transports.File({ filename: process.env.LOG_PATH }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.simple(),
                winston.format.colorize(),
                winston.format.timestamp({ format: "YYYY-MM-DDTHH:mm:ss" }),
            )
        })
    ]
})

module.exports = logger;