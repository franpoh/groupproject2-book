require('dotenv').config();

const jwt = require("jsonwebtoken"); // Import

module.exports = function (req, res, next) {
    const { accessToken } = req.cookies;

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            next();
        } else {
            req.username = user.username;
            req.userId = user.userId;

            next();
        }
    });
}