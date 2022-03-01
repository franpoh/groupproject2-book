require('dotenv').config();

const jwt = require("jsonwebtoken"); // Import

module.exports = function (req, res, next) {
    console.log("authJwt 1")
    const { accessToken, refreshToken } = req.cookies;

    // if (accessToken == null) {
    //     res.status(401);
    //     return res.send("Please login or sign up!");
    // }

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            console.log("authJwt 2")
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) {
                    res.status(403); // token no longer valid
                    res.send("Please login again.")
                }
        
                const accessToken = jwt.sign({ userId: user.userId, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
                res.cookie('accessToken', accessToken, { httpOnly: true }); 
                console.log("authJwt 3")
            });
        }

        req.username = user.username; // eg cmdrshep
        req.userId = user.userId // eg 5

        console.log("authJwt", req.username, req.userId)
        console.log("authJwt 4")
        next();
    });
}