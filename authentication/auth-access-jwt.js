require('dotenv').config();

const jwt = require("jsonwebtoken"); // Import

const { errorCatch, infoLog } = require("../constants/error-catch");
const { fileNameFormat, authenFnNameFormat } = require("../services/service-logger/log-format");
const serviceName = fileNameFormat(__filename, __dirname);



// ----------------------------------------- VERIFY JWT ACCESS TOKEN
function verifyJwtAccess(req, res, next) {

    let fnName = authenFnNameFormat();

    const { accessToken } = req.cookies;

    // check is jwt access token is still valid
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {

        if (err) {
            // error catch - access token expired
            errorCatch(403, "Access token invalid, checking refresh token.", serviceName, fnName);
            next();
            
        } else {
            // infolog
            infoLog("Access token valid, passing on user info.", serviceName, fnName);

            req.username = user.username;
            req.userId = user.userId;

            next();
        }
    });
}

module.exports = {
    verifyJwtAccess
}