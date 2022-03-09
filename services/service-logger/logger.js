const winston = require('winston');

const colorizer = winston.format.colorize();

const logger = winston.createLogger({
    level: 'error',
    format: combine(
        winston.format.timestamp(),
        winston.format.simple(),
        winston.format.printf(msg =>
            colorizer.colorize(msg.level, `${msg.timestamp} - ${msg.level}: ${msg.message}`)
        )
    ),
    defaultMeta: { service: 'summation function' },
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'info.log',
            level: 'info'
        }),
        new winston.transports.File({
            filename: 'debug.log',
            level: 'debug'
        }),
        new winston.transports.File({
            filename: 'error.log',
            level: 'error'
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: 'exceptions.log' })
    ],
    rejectionHandlers: [
        new winston.transports.File({ filename: 'rejections.log' })
    ]

});


module.exports = logger;