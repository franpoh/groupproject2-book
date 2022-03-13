const logger = require("./file-logger");

const Constants = require("../../constants/index");

// ========== info ========== 
//
// data from parent would be {
//     level: Constants.LEVEL_INFO,   or Constants.LEVEL_ERROR
//     serviceName: serviceName,
//     fnName: fnName,
//     text: result.message // res.message if controller
// }
// 
// at head of parent file, const serviceName = fileNameFormat( __filename, __dirname );
// let fnName = fnNameFormat();
//
// ========== info ========== 

const formatLogMsg = function ( data ) {

    let logmessage = `<<<<<<<<<< ${data.serviceName}-[${data.fnName}]: ${data.text} >>>>>>>>>>`     
    
    logger[data.level](logmessage);
    // Answer by snnsnn Ref: https://stackoverflow.com/questions/359788/how-to-execute-a-javascript-function-when-i-have-its-name-as-a-string

    
    // if ( data.level === Constants.LEVEL_INFO ) {
    //     logger.info(logmessage);
    //     return;
    // } else if (data.level === Constants.LEVEL_ERROR) {
    //     logger.error(logmessage);
    //     return;
    // };
    
    return;
};

// Ref: Answer by Red Walrus https://stackoverflow.com/questions/14201475/node-js-getting-current-filename
// extract filename without extension, a = __filename , b = __dirname
const fileNameFormat = function ( a, b ) {
    return a.slice(b.length + 1, -3); // -3 removed extension
};

// function name, Answer by VanagaS  Ref: https://stackoverflow.com/questions/280389/how-do-you-find-out-the-caller-function-in-javascript
// this should be only for services
const fnNameFormat = function () {
    let data = new Error();
    // if new Error is generated at caller, split("\n")[2]    
    return data.stack.split("\n")[3].trim().split(" ")[1];
};

// function name within class, location in error stack is different, inspired by Answer and dicussion by georg Ref: https://stackoverflow.com/questions/38435450/get-current-function-name-in-strict-mode/38435618#38435618
// const controllerFnNameFormat = function ( data ) {
const controllerFnNameFormat = function () {
    let data = new Error();
    // if new Error is generated at caller, split("\n")[1]
    return data.stack.split("\n")[2].trim().split(" ")[1];
};

// 20220313 G1: current authentication-user persmissions has same level of stack as controllerFnNameFormat but split here due possible future changes
const authenFnNameFormat = function () {
    let data = new Error();

    let test = data; 

    // refresh - verify >> [5] is = at Object.module.exports [as verify] 
    // access - verify >> [5] is = at Object.module.exports [as verify] 

    if (test.stack.split("\n")[2].trim().split(" ")[1] === "Object.module.exports") {
        return data.stack.split("\n")[5].trim().split(" ")[2];;
    };
    return data.stack.split("\n")[2].trim().split(" ")[1];
};

module.exports = {
    formatLogMsg,
    fileNameFormat,
    fnNameFormat,
    controllerFnNameFormat,
    authenFnNameFormat
};

