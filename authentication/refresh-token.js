require('dotenv').config();
const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
    const refreshToken = req.cookies.refreshToken;
    console.log("refresh-token.js", refreshToken)

    if (refreshToken == null) {
        res.status(401);
        return res.send("Please login or sign up!");
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, user) {
        if (err) {
            res.status(403); // token no longer valid
            res.send("Please login again.")
        }

        const accessToken = jwt.sign({ userId: user.userId, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
        res.json({ accessToken: accessToken })

        next();
    });
}