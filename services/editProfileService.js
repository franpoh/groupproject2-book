const bcrypt = require("bcrypt");
const saltRounds = 10;

const { ValidationError } = require("sequelize"); // Validation Error is a class item

const { Users } = require("../connect.js");

module.exports = {
    editProfile: async (userId, email, password) => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        const user = await Users.findByPk(userId);

        if (!user) {
            result.message = "User not found. Please try logging in again.";
            result.status = 404;
            return result;
        }

        try {
            let newEmail = email === undefined ? user.email : email;
            let newPassword = password === undefined ? user.password : bcrypt.hashSync(password, saltRounds);

            user.email = newEmail;
            user.password = newPassword;
            await user.save();
            result.status = 200;
            result.data = JSON.stringify(user);
            result.message = "Profile updated!"
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