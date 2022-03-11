// const { createLogger, format, transports } = require('winston');
// const { json, combine, timestamp, simple, cli, label, printf, colorize } = format;

// const outFormat = printf(({ level, message, timestamp, service }) => {
//     return `${timestamp}: ${message}`; // level does not output correctly
// });


// const logger = createLogger({
//     level: 'debug',
//     format: combine(
//         simple(),
//         colorize(),
//         timestamp({ format: "YYYY-MM-DDTHH:mm:ss" }),
//         outFormat
//     ),
//     defaultMeta: { service: 'summation function' },
//     transports: [
//         new transports.Console(),
//         new transports.File({
//             filename: 'combined.log',
//         }),
//         new transports.File({
//             filename: 'info.log',
//             level: 'info'
//         }),
//         new transports.File({
//             filename: 'error.log',
//             level: 'error'
//         })
//     ],
//     exceptionHandlers: [
//         new transports.File({ filename: 'exceptions.log' })
//     ],
//     rejectionHandlers: [
//         new transports.File({ filename: 'rejections.log' })
//     ]

// });


// module.exports = logger;

//testing by g1

// const winston = require("winston");

// const logger = winston.createLogger({
//     level:"info",
//     format:winston.format.json(),
//     transports:[
//         new winston.transports.File({filename:process.env.LOG_PATH}),
//         new winston.transports.Console({format: winston.format.simple()})
//     ]
// })

// module.exports = logger;