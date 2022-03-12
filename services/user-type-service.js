const bcrypt = require("bcrypt");

const Constants = require("../constants/index.js");
const { serviceErrorCatch } = require("../constants/error-catch");
const { formatLogMsg, fileNameFormat, fnNameFormat } = require("./service-logger/log-format");
const serviceName = fileNameFormat( __filename, __dirname );

const { Users } = require("../connect.js");

module.exports = {
    userType: async (editUserId, type, password, userId) => {

        let fnName = fnNameFormat();

        let result = {
            message: null,
            status: null,
            data: null,
        }

        const adminUser = await Users.findByPk(userId);
        const editUser = await Users.findOne({ where: { userId: editUserId } });

        // error catch - if your user is not found
        serviceErrorCatch(result, !adminUser, Constants.USER_NOTFOUND, 404, Constants.LEVEL_ERROR, serviceName, fnName);

        // error catch - if user you wish to edit is not found
        serviceErrorCatch(result, !editUser, "Target user not found.", 404, Constants.LEVEL_ERROR, serviceName, fnName);

        const passwordVerification = await bcrypt.compare(password, adminUser.password);

        // error catch - if password is not verified
        if (!passwordVerification) {
            result.message = "You have entered the wrong password";
            result.status = 400;
            return result;
        }

        // different returns for different user types
        if (type === Constants.USER_BANNED) {
            editUser.type = Constants.USER_BANNED;
            result.message = `User has been set to '${Constants.USER_BANNED}'.`;
        } else if (type === Constants.USER_USER) {
            editUser.type = Constants.USER_USER;
            result.message = `User has been set to '${Constants.USER_USER}'.`;
        } else if (type === Constants.USER_ADMIN) {
            editUser.type = Constants.USER_ADMIN;
            result.message = `User has been set to '${Constants.USER_ADMIN}'.`;
        }

        await editUser.save();
        result.status = 200;
        result.data = editUser;

        // winston logging
        formatLogMsg({
            level: Constants.LEVEL_INFO,
            serviceName: serviceName,
            fnName: fnName,
            text: result.message
        });

        return result;
    }
}