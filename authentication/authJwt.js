require('dotenv').config();
const refreshJwt = require("./auth-refresh-jwt");

const jwt = require("jsonwebtoken"); // Import

module.exports = function (req, res, next) {
    const { accessToken } = req.cookies;

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (user) {
            req.username = user.username;
            req.userId = user.userId;
            next();
        } else if (err) {
            console.log("Access Token Authentication Error: ", err)
            return;
        }
    });

    refreshJwt();
}