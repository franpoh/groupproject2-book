const { Users } = require("../connect.js");

const Constants = require("../constants/index");
const { serviceErrorCatch } = require("../constants/error-catch");
const { formatLogMsg, fileNameFormat, fnNameFormat } = require("./service-logger/log-format");
const serviceName = fileNameFormat( __filename, __dirname );

module.exports = {
    searchUser: async (username) => {

        let fnName = fnNameFormat();

        let result = {
            message: null,
            status: null,
            data: null,
        }

        const user = await Users.findAll({
            where:
                { username: username },
            attributes: {
                exclude:
                    ['password', 'wishlist', 'imageURL', 'updatedAt']
            }
        });

        // error catching for if nothing is in found user(s) array
        serviceErrorCatch(result, user.length === 0, Constants.USER_NOTFOUND, 404, Constants.LEVEL_ERROR, serviceName, fnName);

        result.data = user;
        result.status = 200;
        result.message = "User found.";

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