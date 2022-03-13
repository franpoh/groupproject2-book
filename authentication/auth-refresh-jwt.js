require('dotenv').config();

const jwt = require("jsonwebtoken"); // Import

const Constants = require("../constants/index");

const { errorCatch, infoLog } = require("../constants/error-catch");
const { fileNameFormat, fnNameFormat, authenFnNameFormat } = require("../services/service-logger/log-format");
const serviceName = fileNameFormat(__filename, __dirname);



// ----------------------------------------- VERIFY JWT REFRESH TOKEN
module.exports = function (req, res, next) {

    let fnName = "infolog text manual";

    const { refreshToken } = req.cookies;

    if (req.username && req.userId) {
        // info log
        infoLog("Access token valid, received user info.", serviceName, fnName);
        next();
    } else {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) {
                // error catch - refresh token has expired
                let result = errorCatch(403, "Refresh token authentication error.", serviceName, authenFnNameFormat());
                res.status(result.status).json({ message: "Please login again." });

            } else if (user) {
                const accessToken = jwt.sign({ userId: user.userId, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
                res.cookie(Constants.ACCESS_TOKEN, accessToken, { httpOnly: true, sameSite: "None", secure: true });

                // infolog
                infoLog("Refresh token valid, refreshed access token.", serviceName, authenFnNameFormat());

                req.username = user.username;
                req.userId = user.userId;

                next();
            }
        });
    }
}