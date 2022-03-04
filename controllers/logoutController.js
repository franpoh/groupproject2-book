class logoutController {
    async logout(req, res) {
        let status = "";
        let msg = "";

        try {
            const { accessToken, refreshToken } = req.cookies;

            res.clearCookie('refreshToken', refreshToken, {path: "/", domain: "book-libraryshop.herokuapp.com", httpOnly: true, sameSite: "None", secure: true});
            res.clearCookie('accessToken', accessToken, {path: "/", domain: "book-libraryshop.herokuapp.com", httpOnly: true, sameSite: "None", secure: true});
            
            status = 204;
            msg = "Your logout is successful!"
        } catch (err) {
            status = 400;
            msg = "Your logout is unsuccessful!"
        }

        return res.status(status).json({ message: msg });
    }
}

module.exports = logoutController;