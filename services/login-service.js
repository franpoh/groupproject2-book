require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Constants = require("../constants/index.js");

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

        const user = await Users.findOne({ where: { email: email } });

        // error catch - if email is invalid
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

        const passwordVerification = await bcrypt.compare(password, user.password);

        // error catch - if password is invalid
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