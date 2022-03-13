require('dotenv').config();

const jwt = require("jsonwebtoken"); // Import

const Constants = require("../constants/index");

const { errorCatch, infoLog } = require("../constants/error-catch");
const { fileNameFormat, authenFnNameFormat } = require("../services/service-logger/log-format");
const serviceName = fileNameFormat(__filename, __dirname);



// ----------------------------------------- VERIFY JWT REFRESH TOKEN
function verifyJwtRefresh(req, res, next) {

    let fnName = authenFnNameFormat();

    const { refreshToken } = req.cookies;

    // if we receive username and userid from auth-access-jwt, allow access
    if (req.username && req.userId) {
        // info log
        infoLog("Access token valid, received user info.", serviceName, fnName);
        next();

    } else {
        // see if jwt refresh token is still valid
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {

            if (err) {
                // error catch - refresh token has expired
                let result = errorCatch(403, "Refresh token authentication error.", serviceName, fnName);
                res.status(result.status).json({ message: "Please login again." });

            } else if (user) {
                // create new jwt access token
                const accessToken = jwt.sign({ userId: user.userId, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });

                // assign jwt token to cookie
                res.cookie(Constants.ACCESS_TOKEN, accessToken, { httpOnly: true, sameSite: "None", secure: true });

                // infolog
                infoLog("Refresh token valid, refreshed access token.", serviceName, fnName);

                req.username = user.username;
                req.userId = user.userId;

                next();
            }
        });
    }
}

module.exports = {
    verifyJwtRefresh
}