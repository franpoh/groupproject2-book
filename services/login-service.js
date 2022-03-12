require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Constants = require("../constants/index.js");
const { serviceErrorCatch } = require("../constants/error-catch");

const { formatLogMsg, fileNameFormat, fnNameFormat }= require("./service-logger/log-format");
const serviceName = fileNameFormat( __filename, __dirname );

const { Users } = require("../connect.js");

module.exports = {
    login: async (email, password) => {

        let fnName = fnNameFormat();

        let result = {
            message: null,
            status: null,
            data: null,
        }

        // error catching for finding if email exists
        const user = await Users.findOne({ where: { email: email } });

        // serviceErrorCatch(result, !user, Constants.EMAIL_INVALID, 400);

        // const passwordVerification = await bcrypt.compare(password, user.password);

        // serviceErrorCatch(result, !passwordVerification, Constants.PASSWORD_INVALID, 400);

        
        if (!user) {
            result.message = "You have entered the wrong email.";
            result.status = 400;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        }

        // error catching for password verification
        const passwordVerification = await bcrypt.compare(password, user.password);

        if (!passwordVerification) {
            result.message = "You have entered the wrong password.";
            result.status = 400;

            formatLogMsg({
                level: Constants.LEVEL_ERROR,
                serviceName: serviceName,
                fnName: fnName,
                text: result.message
            });

            return result;
        }

        // user id and username object to be passed into jwt tokens
        const loginData = {
            userId: user.userId,
            username: user.username
        }

        // creating jwt tokens
        // access and refresh for long term login
        const accessToken = jwt.sign(loginData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
        const refreshToken = jwt.sign(loginData, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

        result.data = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            userType: user.type,
        };

        result.status = 200;
        result.message = "Login is successful! Redirecting...";

        formatLogMsg({
            level: Constants.LEVEL_INFO,
            serviceName: serviceName,
            fnName: fnName,
            text: result.message
        });
        
        return result;
    }
}