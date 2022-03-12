require('dotenv').config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Constants = require("../constants/index.js");

const { errorCatch, infoLog } = require("../constants/error-catch");
const { fileNameFormat, fnNameFormat } = require("./service-logger/log-format");
const serviceName = fileNameFormat(__filename, __dirname);

const { Users } = require("../connect.js");



// ----------------------------------------- PASSED TO ACCESS CONTROLLER
module.exports = {
    
    login: async (email, password) => {

        let fnName = fnNameFormat();

        // use email to find matching user in user table
        const user = await Users.findOne({ where: { email: email } });

        // error catch - if email is invalid
        if (!user) {
            let response = errorCatch(400, Constants.EMAIL_INVALID, serviceName, fnName);
            return response;
        }

        // verify password
        const passwordVerification = await bcrypt.compare(password, user.password);

        // error catch - if password is invalid
        if (!passwordVerification) {
            let response = errorCatch(400, Constants.PASSWORD_INVALID, serviceName, fnName);
            return response;
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

        let response = infoLog("Login is successful! Redirecting...", serviceName, fnName);

        response.data = {
            accessToken: accessToken,
            refreshToken: refreshToken,
            userType: user.type,
        };

        return response;
    }
}