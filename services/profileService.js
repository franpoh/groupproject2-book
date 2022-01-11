const bcrypt = require("bcrypt");
const saltRounds = 10;

const { Users } = require("../connect.js");

module.exports = {
    viewProfile: async (username) => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        const user = await Users.findOne({ where: { username: username } });

        result.status = 200;
        result.data = JSON.stringify(user);
        result.message = "Welcome to your profile!";
        return result;
    },

    editProfile: async (username, email, password) => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        console.log("Req Profile: ", email, " ", password);

        const user = await Users.findOne({ where: { username: username } });

        let newEmail = email === undefined ? user.email : email;
        let newPassword = password === undefined ? user.password : bcrypt.hashSync(password, saltRounds);

        console.log("Edit Profile: ", newEmail, " ", newPassword);

        user.email = newEmail;
        user.password = newPassword;
        await user.save();
        result.status = 200;
        result.data = user;
        result.message = "Profile updated!"
        return result;
    }
}