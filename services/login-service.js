require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Constants = require("../constants/index.js");
const { serviceErrorCatch } = require("../constants/error-catch");

const { Users } = require("../connect.js");

module.exports = {
    login: async (email, password) => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        console.log("TEST IN LOGIN SERVICE", user, password);

        const user = await Users.findOne({ where: { email: email } });

        serviceErrorCatch(result, !user, Constants.EMAIL_INVALID, 400);

        const passwordVerification = await bcrypt.compare(password, user.password);

        serviceErrorCatch(result, !passwordVerification, Constants.PASSWORD_INVALID, 400);

        // if (!user) {
        //     result.message = "You have entered the wrong email.";
        //     result.status = 400;
        //     return result;
        // }

        // if (!passwordVerification) {
        //     result.message = "You have entered the wrong password.";
        //     result.status = 400;
        //     return result;
        // }

        const loginData = {
            userId: user.userId,
            username: user.username
        }

        const accessToken = jwt.sign(loginData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
        const refreshToken = jwt.sign(loginData, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        result.data = {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
        
        result.status = 200;
        result.message = "Login is successful! Redirecting...";
        return result;
    }
}