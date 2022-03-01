require('dotenv').config();

const jwt = require("jsonwebtoken"); // Import

module.exports = function (req, res, next) {
    const { accessToken, refreshToken } = req.cookies;

    // const authHeader = req.headers['authorization']; // Bearer <token>

    // console.log("authJwt", authHeader);

    // // if we have an authHeader, then return the token portion of authHeader, otherwise return undefined
    // const token = authHeader && authHeader.split(' ')[1]; // splitting Bearer from <token>

    if (accessToken == null) {
        res.status(401);
        return res.send("Please login or sign up!");
    }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, function (err, user) {
        if (err) {
            if (refreshToken == null) {
                res.status(401);
                return res.send("Please login or sign up!");
            } else {
                jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, function (err, user) {
                    if (err) {
                        res.status(403); // token no longer valid
                        res.send("Please login again.")
                    }
            
                    const accessToken = jwt.sign({ userId: user.userId, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
                    res.cookie('accessToken', accessToken, { httpOnly: true }); 
                });
            }

            res.status(403); // token no longer valid
            res.send("Please login again.")
        }

        req.username = user.username; // eg cmdrshep
        req.userId = user.userId // eg 5

        next();
    });
}