const bcrypt = require("bcrypt");

const Constants = require("../constants/index.js");
const { errorCatch, infoLog } = require("../constants/error-catch");
const { formatLogMsg, fileNameFormat, fnNameFormat } = require("./service-logger/log-format");
const serviceName = fileNameFormat(__filename, __dirname);

const { Users } = require("../connect.js");

module.exports = {
    userType: async (editUserId, type, password, userId) => {

        let fnName = fnNameFormat();

        // let result = {
        //     message: null,
        //     status: null,
        //     data: null,
        // }

        let msg = '';

        const adminUser = await Users.findByPk(userId);
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

        await editUser.save();

        // infolog
        let response = infoLog(msg, serviceName, fnName);
        response.data = editUser;
        return response;

        // result.status = 200;
        // result.data = editUser;

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