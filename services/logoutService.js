module.exports = {
    logout: async () => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');

        result.status = 204;
        result.message = "Your logout is successful!";
        return result;
    }
}