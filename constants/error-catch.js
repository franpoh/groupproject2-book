const Constants = require("./index");

const { formatLogMsg } = require("../services/service-logger/log-format");

function validEmail(email) {
    const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(String(email).toLowerCase());
}

function pwdByteLen(pwd) {
    return new TextEncoder().encode(pwd).length
}

function errorCatch(status, msg, serviceName, fnName) {
    let result = {
        status: null,
        message: null,
    }

    formatLogMsg({
        level: Constants.LEVEL_ERROR,
        serviceName: serviceName,
        fnName: fnName,
        text: msg,
    });

    result.status = status;
    result.message = msg;

    return result;
}

// ----------- for use in controllers
// if (error) {
//     let result = errorCatch(status, msg, serviceName, fnName);
//     return res.status(result.status).json({ message: result.message });
// }

// ----------- for use in services
// if (error) {
//     let response = errorCatch(status, msg, serviceName, fnName);
//     result.message = response.message;
//     result.status = response.status;
//     return result;
// }

// ----------- for use in services
// if (error) {
//     let response = errorCatch(status, msg, serviceName, fnName);
//     return response;
// }

function infoLog(msg, serviceName, fnName) {
    let result = {
        status: null,
        message: null,
        data: null,
    }

    formatLogMsg({
        level: Constants.LEVEL_INFO,
        serviceName: serviceName,
        fnName: fnName,
        text: msg,
    });

    result.status = 200;
    result.message = msg;
    result.data = null;

    return result;
}

// ----------- for use in services
// let response = infoLog(msg, serviceName, fnName);
// return response;






// might mess up the order of some error checking
// function serviceErrorCatch(status, msg, serviceName, fnName) {
//     let result = {
//         status: null,
//         msg: null,
//     }

//         formatLogMsg({
//             level: Constants.LEVEL_ERROR,
//             serviceName: serviceName,
//             fnName: fnName,
//             text: msg,
//         });
// }

// if (error) {

//     result.message = Constants.PASSWORD_INVALID;
//     result.status = 400;

//     // winston logging
//     formatLogMsg({
//         level: Constants.LEVEL_ERROR,
//         serviceName: serviceName,
//         fnName: fnName,
//         text: result.message
//     });

//     return result;
// }

module.exports = {
    validEmail,
    errorCatch,
    pwdByteLen,
    infoLog,
}
