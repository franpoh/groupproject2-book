require('dotenv').config();

const jwt = require("jsonwebtoken"); // Import

module.exports = function (req, res, next) {
    const authHeader = req.headers['authorization']; // Bearer <token>

    // if we have an authHeader, then return the token portion of authHeader, otherwise return undefined
    const token = authHeader && authHeader.split(' ')[1]; // splitting Bearer from <token>

    if (token == null) {
        res.status(401);
        return res.send("Please login or sign up!");
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
        if (err) {
            res.status(403); // token no longer valid
            res.send("Please login again.")
        }

        req.username = user.username; // eg cmdrshep
        req.userId = user.userId // eg 5

        next();
    });
}