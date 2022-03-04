module.exports = {
    logout: async () => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        try {
            const { accessToken, refreshToken } = req.cookies;

            console.log("TESTING LOGOUT");
            res.clearCookie('refreshToken', { httpOnly: true, secure: true, domain: "book-libraryshop.herokuapp.com", path: "/" });
            res.clearCookie('accessToken', { httpOnly: true, secure: true, domain: "book-libraryshop.herokuapp.com", path: "/" });
            
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