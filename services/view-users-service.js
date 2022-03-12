const { Users } = require("../connect.js");

const Constants = require("../constants/index.js");
const { errorCatch, infoLog } = require("../constants/error-catch");
const { formatLogMsg, fileNameFormat, fnNameFormat } = require("./service-logger/log-format");
const serviceName = fileNameFormat(__filename, __dirname);

module.exports = {
    viewUsers: async () => {

        let fnName = fnNameFormat();

        // let result = {
        //     message: null,
        //     status: null,
        //     data: null,
        // }

        const users = await Users.findAll({
            attributes: {
                exclude:
                    ['password', 'wishlist', 'imageURL', 'updatedAt']
            }
        });

        // error catch - no users are found
        if (!users || users.length === 0) {
            let response = errorCatch(404, "Users not found", serviceName, fnName);
            return response;
        }

        let response = infoLog("All users in database.", serviceName, fnName);
        response.data = users;
        return response;

        // result.data = users;
        // result.status = 200;
        // result.message = "All users in database.";

        // // winston logging
        // formatLogMsg({
        //     level: Constants.LEVEL_INFO,
        //     serviceName: serviceName,
        //     fnName: fnName,
        //     text: result.message
        // });

        // return result;
    }
}