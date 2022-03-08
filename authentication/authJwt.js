require('dotenv').config();

const jwt = require("jsonwebtoken"); // Import

module.exports = function (req, res, next) {
    const { accessToken, refreshToken } = req.cookies;

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log("Access token authentication error: ", err);
        } else {
            req.username = user.username;
            req.userId = user.userId;

            next();
        }
    });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log("Refresh token authentication error: ", err);
            res.status(403); // token no longer valid
            res.send("Please login again.")
        } else {
            const accessToken = jwt.sign({ userId: user.userId, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
            res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: "None", secure: true });

            req.username = user.username;
            req.userId = user.userId;

            next();
        }
    });
}