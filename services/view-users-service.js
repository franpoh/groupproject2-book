const { Users } = require("../connect.js");

const Constants = require("../constants/index.js");
const { serviceErrorCatch } = require("../constants/error-catch");
const { formatLogMsg, fileNameFormat, fnNameFormat } = require("./service-logger/log-format");
const serviceName = fileNameFormat( __filename, __dirname );

module.exports = {
    viewUsers: async () => {

        let fnName = fnNameFormat();

        let result = {
            message: null,
            status: null,
            data: null,
        }

        const users = await Users.findAll({ 
            attributes: { exclude: 
                ['password', 'wishlist', 'imageURL', 'updatedAt'] 
            } 
        });

        // error catch - no users are found
        serviceErrorCatch(result, !users, "Users not found", 404, Constants.LEVEL_ERROR, serviceName, fnName);

        result.data = users;
        result.status = 200;
        result.message = "All users in database.";

        // winston logging
        formatLogMsg({
            level: Constants.LEVEL_ERROR,
            serviceName: serviceName,
            fnName: fnName,
            text: result.message
        });

        return result;
    }
}