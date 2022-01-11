require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { Users } = require("../connect.js");

module.exports = {
    login: async (email, password) => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        const findEmail = await Users.findOne({ where: { email: email } });

        if (!findEmail) {
            result.message = `${email} doesn't exist.`;
            result.status = 400;
            return result;
        }

        const passwordVerification = await bcrypt.compare(password, findEmail.dataValues.password);

        if (!passwordVerification) {
            result.message = "You have entered the wrong password";
            result.status = 400;
            return result;
        }

        const loginData = {
            userId: findEmail.dataValues.userId,
            username: findEmail.dataValues.username
        }

        const loginToken = jwt.sign(loginData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

        result.data = loginToken;
        result.status = 200;
        result.message = "Your login is successful!";
        return result;
    }
}