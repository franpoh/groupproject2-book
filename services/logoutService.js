module.exports = {
    logout: async () => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        try {
            console.log("TESTING LOGOUT");

            const { accessToken, refreshToken } = req.cookies;
            res.clearCookie('refreshToken', refreshToken, {domain: "book-libraryshop.herokuapp.com", path: "/", httpOnly: true, sameSite: "None", secure: true});
            res.clearCookie('accessToken', accessToken, {domain: "book-libraryshop.herokuapp.com", path: "/", httpOnly: true, sameSite: "None", secure: true});
            
            result.status = 204;
            result.message = "Your logout is successful!";
            return result;
        } catch (err) {
            result.status = 400;
            result.message = "Your logout is unsuccessful!";
            return result;
        }
    }
}