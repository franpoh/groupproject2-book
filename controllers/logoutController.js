class logoutController {
    async logout(req, res) {
        try {
            const { accessToken, refreshToken } = await req.cookies;

            await res.clearCookie('refreshToken', refreshToken, {path: "/", domain: "book-libraryshop.herokuapp.com", httpOnly: true, sameSite: "None", secure: true});
            await res.clearCookie('accessToken', accessToken, {path: "/", domain: "book-libraryshop.herokuapp.com", httpOnly: true, sameSite: "None", secure: true});

            console.log("Checking for Cookies: ", req.cookies);
            
            return res.status(204).json({ message: "Your logout is successful!" });
        } catch (err) {
            return res.status(400).json({ message: "Your logout is unsuccessful!" });
        }
    }
}

module.exports = logoutController;