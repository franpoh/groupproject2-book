//testing by g1

const winston = require("winston");

const outFormat = winston.format.printf(({ level, message, timestamp, service }) => {
    return `${level} - ${message}`;
});

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize(),
        // winston.format.timestamp({ format: "YYYY-MM-DDTHH:mm:ss" }),
    ),
    transports: [
        new winston.transports.File({ filename: process.env.LOG_PATH }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.simple(),
                winston.format.colorize({ all: true }),
                // winston.format.timestamp({ format: "YYYY-MM-DDTHH:mm:ss" }),
                outFormat
            )
        })
    ]
})

module.exports = logger;