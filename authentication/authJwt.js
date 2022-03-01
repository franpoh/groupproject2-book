require('dotenv').config();

const jwt = require("jsonwebtoken"); // Import

module.exports = function (req, res, next) {
    const { accessToken, refreshToken } = req.cookies;

    // jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    //     if (err) {
    //         jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    //             if (err) {
    //                 res.status(403); // token no longer valid
    //                 res.send("Please login again.")
    //             }

    //             const accessToken = jwt.sign({ userId: user.userId, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
    //             res.cookie('accessToken', accessToken, { httpOnly: true }); 
    //         });
    //     }

    //     req.username = user.username; // eg cmdrshep
    //     req.userId = user.userId // eg 5

    //     next();
    // });

    if (accessToken) {
        try {
            const { user } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            req.username = user.username;
            req.userId = user.userId;
            next();
        } catch (err) {
            if (refreshToken) {
                try {
                    const { user } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
                    const accessToken = jwt.sign({ userId: user.userId, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15s" });
                    res.cookie('accessToken', accessToken, { httpOnly: true });
                    req.username = user.username;
                    req.userId = user.userId
                    next();
                } catch (err) {
                    res.status(403); // token no longer valid
                    res.send("Please login again.")
                }
            }
        }
    }
}