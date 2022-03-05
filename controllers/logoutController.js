class logoutController {
    async logout(req, res) {

        try {
            const { accessToken, refreshToken } = req.cookies;

            res.clearCookie('refreshToken', {httpOnly: true, sameSite: "None", secure: true});
            res.clearCookie('accessToken', {httpOnly: true, sameSite: "None", secure: true});
            
            res.status(200);
            return res.json({ message: "Logout is successful!" });
        } catch (err) {
            res.status(400);
            return res.json({ message: "Logout is unsuccessful!" });
        }
    }
}

module.exports = logoutController;