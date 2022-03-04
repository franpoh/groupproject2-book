module.exports = {
    logout: async () => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        let p = new Promise((resolve, reject) => {
            res.clearCookie('refreshToken');
            res.clearCookie('accessToken');
            
            resolve("Your logout is successful!");
            reject("Your logout is unsuccessful!");
        })

        p.then((msg) => {
            result.status = 204;
            result.message = msg;
            return result;
        }).catch((err) => {
            result.status = 400;
            result.message = err;
            return result;
        })
    }
}