const bcrypt = require("bcrypt");

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
            editUser.type = "BANNED";
            result.message = "User has been set to 'BANNED'.";
        } else if (type === "user") {
            editUser.type = "USER";
            result.message = "User has been set to 'USER'.";
        } else if (type === "admin") {
            editUser.type = "ADMIN";
            result.message = "User has been set to 'ADMIN'.";
        }

        await editUser.save();
        result.status = 200;
        result.data = editUser;
        return result;
    }
}