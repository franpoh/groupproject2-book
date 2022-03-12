const { Users } = require("../connect.js");

const Constants = require("../constants/index");
const { errorCatch, infoLog } = require("../constants/error-catch");
const { fileNameFormat, fnNameFormat } = require("./service-logger/log-format");
const serviceName = fileNameFormat(__filename, __dirname);



// ----------------------------------------- PASSED TO ADMIN CONTROLLER
module.exports = {
    
    searchUser: async (username) => {

        let fnName = fnNameFormat();

        // use username to find all matching users in user table
        // however, omit data defined in attributes in the return
        const user = await Users.findAll({
            where:
                { username: username },
            attributes: {
                exclude:
                    ['password', 'wishlist', 'imageURL', 'updatedAt']
            }
        });

        // error catching for if nothing is in found user(s) array
        if (user.length === 0) {
            let response = errorCatch(404, Constants.USER_NOTFOUND, serviceName, fnName);
            return response;
        }

        // infolog
        let response = infoLog("User found.", serviceName, fnName);
        response.data = user;
        return response;
    }
}