const bcrypt = require("bcrypt");
const Constants = require("../constants/index.js");
const { serviceErrorCatch } = require("../constants/error-catch");

const { Users } = require("../connect.js");

module.exports = {
    editUserType: async (username, type, password, userId) => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        const adminUser = await Users.findByPk(userId);

        if (!adminUser) {
            result.message = "User not found. Please try logging in again.";
            result.status = 404;
            return result;
        }

        const editUser = await Users.findOne({ where: { username: username } });

        if (!editUser) {
            result.message = "The user that you wish to edit has not been found.";
            result.status = 404;
            return result;
        }

        const passwordVerification = await bcrypt.compare(password, adminUser.password);

        if (!passwordVerification) {
            result.message = "You have entered the wrong password";
            result.status = 400;
            return result;
        }

        if (type === "ban") {
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