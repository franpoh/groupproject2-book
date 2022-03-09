const bcrypt = require("bcrypt");
const saltRounds = 10;

const Constants = require("../constants/index");

const { ValidationError } = require("sequelize"); // Validation Error is a class item

const { Users } = require("../connect.js");

module.exports = {
    editProfile: async (userId, email, oldPassword, newPassword) => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        const user = await Users.findByPk(userId);
        const findEmail = Users.findAll({ where: { email: email }});

        // error catching
        if (!user) {
            result.message = "User not found, try logging in again.";
            result.status = 404;
            return result;
        }

        if (findEmail) {
            result.status = 200;
            result.message = Constants.EMAIL_INUSE;
            return result;
        }

        const passwordVerification = await bcrypt.compare(oldPassword, user.password);

        if (!passwordVerification) {
            result.message = Constants.PASSWORD_INVALID;
            result.status = 400;
            return result;
        }

        try {

            // If new email/password not specified, use old email/password
            let newEmail = !email ? user.email : email;
            let newPwd = !newPassword ? user.password : bcrypt.hashSync(newPassword, saltRounds);

            // Message depending on what was edited
            let newMsg = !newPassword ? "Profile Updated!" : "Password Updated! Logging you out..."

            user.email = newEmail;
            user.password = newPwd;
            await user.save();

            result.status = 200;
            result.data = JSON.stringify(user);
            result.message = newMsg;
            return result;

        } catch (error) {

            if (error instanceof ValidationError) {
                console.error("This is a validation error: ", error);
                result.message = error.errors[0].message;
                result.status = 400;
                return result;
            }
            
            result.message = error.errors[0].message;
            result.status = 400;
            return result;
        }
    }
}