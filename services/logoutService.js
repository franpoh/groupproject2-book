module.exports = {
    logout: async () => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        try {
            console.log("TESTING LOGOUT");
            res.clearCookie('refreshToken', {domain: "book-libraryshop.herokuapp.com", path: "/"}, {httpOnly: true, sameSite: "None", secure: true});
            res.clearCookie('accessToken', {domain: "book-libraryshop.herokuapp.com", path: "/"}, {httpOnly: true, sameSite: "None", secure: true});
            
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