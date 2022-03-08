require('dotenv').config();
const refreshJwt = require("./auth-refresh-jwt");

const jwt = require("jsonwebtoken"); // Import

module.exports = function (req, res, next) {
    const { accessToken, refreshToken } = req.cookies;

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (user) {
            req.username = user.username;
            req.userId = user.userId;
            next();
        } else if (err) {
            console.log("Access Token Authentication Error: ", err)
        }
    });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log("Refresh Token Authentication Error: ", err)
            res.status(403).json({ message: "Please login again." }); // token no longer valid
        } else if (user) {
            const accessToken = jwt.sign({ userId: user.userId, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
            res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: "None", secure: true });

            req.username = user.username;
            req.userId = user.userId;

            next();
        }
    });
}