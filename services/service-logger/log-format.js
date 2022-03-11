const logger = require("./file-logger");

const formatLogMsg = function ( data ) {
    
    if ( data.level === 'info' ) {
        logger.info(`<<<<<<<<<<${data.serviceName}-[${data.fnName}]: ${data.text}>>>>>>>>>>`);
        return;
    } else if (data.level === 'error') {
        logger.error(`<<<<<<<<<<${data.serviceName}-[${data.fnName}]: ${data.text}>>>>>>>>>>`);
        return;
    };
    
    return;
};

module.exports = formatLogMsg;

