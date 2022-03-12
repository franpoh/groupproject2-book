const { Users } = require("../connect.js");

const { errorCatch, infoLog } = require("../constants/error-catch");
const { fileNameFormat, fnNameFormat } = require("./service-logger/log-format");
const serviceName = fileNameFormat(__filename, __dirname);



// ----------------------------------------- PASSED TO ADMIN CONTROLLER
module.exports = {
    
    viewUsers: async () => {

        let fnName = fnNameFormat();

        // find all users in user table
        // however, omit data defined in attributes in the return
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

        // infolog
        let response = infoLog("All users in database.", serviceName, fnName);
        response.data = users;
        return response;
    }
}