const Constants = require("./index");

const { formatLogMsg } = require("../services/service-logger/log-format");



// ----------------------------------------- CHECK IF EMAIL IS VALID
function validEmail(email) {
    const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(String(email).toLowerCase());
}

// ----------------------------------------- CHECK PASSWORD BYTE LENGTH
function pwdByteLen(pwd) {
    return new TextEncoder().encode(pwd).length
}



// ----------------------------------------- ERROR CATCHING
function errorCatch(status, msg, serviceName, fnName) {
    let result = {
        status: null, // status code
        message: null, // message for display and for winston
        data: null,
    }

    // winston logging
    formatLogMsg({
        level: Constants.LEVEL_ERROR, // default error level
        serviceName: serviceName,
        fnName: fnName,
        text: msg,
    });

    result.status = status;
    result.message = msg;
    result.data = null;

    return result;
}

// ----------- for use in controllers
// if (error) {
    // let result = errorCatch(status, msg, serviceName, fnName);
    // return res.status(result.status).json({ message: result.message });
// }

// ----------- for use in services
// if (error) {
//     let response = errorCatch(status, msg, serviceName, fnName);
//     response.data = data; // this is optional
//     return response; // response will effectively replace 'result' in services, so you can delete it
// }

// ----------- can also be used like this
// let result = errorCatch(status, msg, serviceName, fnName);
// return <whatever>;



// ----------------------------------------- INFO CATCHING
function infoLog(msg, serviceName, fnName) {
    let result = {
        status: null, // status code
        message: null, // message for display and for winston
        data: null,
    }

    formatLogMsg({
        level: Constants.LEVEL_INFO, // default info level
        serviceName: serviceName,
        fnName: fnName,
        text: msg,
    });

    result.status = 200;
    result.message = msg;
    result.data = null;

    return result;
}

// ----------- for use in controllers
// let result = infoLog(msg, serviceName, fnName);
// return res.status(result.status).json({ message: result.message, data: result.data });

// ----------- for use in services
// let response = infoLog(msg, serviceName, fnName);
// response.data = <data>; // this is optional
// return response; // response will effectively replace 'result' in services, so you can delete it



module.exports = {
    validEmail,
    errorCatch,
    pwdByteLen,
    infoLog,
}
