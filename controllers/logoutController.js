class logoutController {
    async logout(req, res) {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        // try {
        //     const { accessToken, refreshToken } = req.cookies;

        //     res.clearCookie('refreshToken', refreshToken, {path: "/", domain: "book-libraryshop.herokuapp.com", httpOnly: true, sameSite: "None", secure: true});
        //     res.clearCookie('accessToken', accessToken, {path: "/", domain: "book-libraryshop.herokuapp.com", httpOnly: true, sameSite: "None", secure: true});
            
        //     return res.status(204).json({ message: "Your logout is successful!" });
        // } catch (err) {
        //     return res.status(400).json({ message: "Your logout is unsuccessful!" });
        // }

        let p = await new Promise ((resolve, reject) => {
            // const { accessToken, refreshToken } = req.cookies;

            res.clearCookie('refreshToken');
            res.clearCookie('accessToken');

            console.log("Checking for cookies: ", req.cookies)

            resolve("Your logout is successful!");
            reject("Your logout is unsuccessful!");
        })

        p.then((msg) => {
            result.message = msg;
            result.status = 204;
            return result;
        }).catch((err) => {
            result.message = err;
            result.status = 400;
            return result;
        })

        return res.status(result.status).json({ message: result.message });
    }
}

module.exports = logoutController;