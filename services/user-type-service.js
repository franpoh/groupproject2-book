const bcrypt = require("bcrypt");

const Constants = require("../constants/index.js");
const { errorCatch, infoLog } = require("../constants/error-catch");
const { fileNameFormat, fnNameFormat } = require("./service-logger/log-format");
const serviceName = fileNameFormat(__filename, __dirname);

const { Users } = require("../connect.js");



// ----------------------------------------- PASSED TO ADMIN CONTROLLER
module.exports = {
    
    userType: async (editUserId, type, password, userId) => {

        let fnName = fnNameFormat();

        let msg = '';

        // use userid to find user in user table, for admin user side
        const adminUser = await Users.findByPk(userId);

        // use user id to find user in user table, for edit user side
        const editUser = await Users.findOne({ where: { userId: editUserId } });

        // error catch - if your user is not found
        if (!adminUser) {
            let response = errorCatch(404, Constants.USER_NOTFOUND, serviceName, fnName);
            return response;
        }

        // error catch - if user you wish to edit is not found
        if (!editUser) {
            let response = errorCatch(404, "Target user not found.", serviceName, fnName);
            return response;
        }

        // verify password
        const passwordVerification = await bcrypt.compare(password, adminUser.password);

        // error catch - if password is not verified
        if (!passwordVerification) {
            let response = errorCatch(400, Constants.PASSWORD_INVALID, serviceName, fnName);
            return response;
        }

        // different returns for different user types
        if (type === Constants.USER_BANNED) {
            editUser.type = Constants.USER_BANNED;
            msg = `User has been set to '${Constants.USER_BANNED}'.`;
        } else if (type === Constants.USER_USER) {
            editUser.type = Constants.USER_USER;
            msg = `User has been set to '${Constants.USER_USER}'.`;
        } else if (type === Constants.USER_ADMIN) {
            editUser.type = Constants.USER_ADMIN;
            msg = `User has been set to '${Constants.USER_ADMIN}'.`;
        }

        // save information in previously defined edit user
        await editUser.save();

        // infolog
        let response = infoLog(msg, serviceName, fnName);
        response.data = editUser;
        return response;
    }
}