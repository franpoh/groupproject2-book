require('dotenv').config();

const jwt = require("jsonwebtoken"); // Import

const { errorCatch, infoLog } = require("../constants/error-catch");
const { fileNameFormat, fnNameFormat, authenFnNameFormat } = require("../services/service-logger/log-format");
const serviceName = fileNameFormat(__filename, __dirname);



// ----------------------------------------- VERIFY JWT ACCESS TOKEN
module.exports = function (req, res, next) {

    // let fnName = authenFnNameFormat();

    const { accessToken } = req.cookies;

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            // error catch - access token expired
            errorCatch(403, "Access token invalid, checking refresh token.", serviceName, authenFnNameFormat());
            next();
        } else {
            // infolog
            infoLog("Access token valid, passing on user info.", serviceName, authenFnNameFormat());

            req.username = user.username;
            req.userId = user.userId;

            next();
        }
    });
}