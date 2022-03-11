const logger = require("./file-logger");

const formatLogMsg = function ( data ) {

    let logmessage = `<<<<<<<<<< ${data.serviceName}-[${data.fnName}]: ${data.text} >>>>>>>>>>` 
    
    if ( data.level === 'info' ) {
        logger.info(logmessage);
        return;
    } else if (data.level === 'error') {
        logger.error(logmessage);
        return;
    };
    
    return;
};

const fileNameFormat = function ( a, b ) {
    console.log('<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>', a, b);
    return a.slice(b.length + 1, -3);
};

module.exports = {
    formatLogMsg,
    fileNameFormat
};

