const bcrypt = require("bcrypt");
const Constants = require("../constants/index.js");
const { serviceErrorCatch } = require("../constants/error-catch");

const { Users } = require("../connect.js");

module.exports = {
    userType: async (editUserId, type, password, userId) => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        const adminUser = await Users.findByPk(userId);
        const editUser = await Users.findOne({ where: { userId: editUserId } });
        const passwordVerification = await bcrypt.compare(password, adminUser.password);

        // error catching

        // serviceErrorCatch(result, !adminUser, Constants.USER_NOTFOUND, 404);
        // serviceErrorCatch(result, !editUser, "Target user not found.", 404);
        // serviceErrorCatch(result, !passwordVerification, Constants.PASSWORD_INVALID, 400);

        if (!adminUser) {
            result.message = "User not found. Please try logging in again.";
            result.status = 404;
            return result;
        }

        if (!editUser) {
            result.message = "The user that you wish to edit has not been found.";
            result.status = 404;
            return result;
        }

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
        return result;
    }
}