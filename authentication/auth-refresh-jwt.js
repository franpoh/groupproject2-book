require('dotenv').config();

const jwt = require("jsonwebtoken"); // Import

module.exports = function (req, res, next) {
    const { refreshToken } = req.cookies;

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