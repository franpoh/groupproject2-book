const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const fs = require("fs");
const privateKey = fs.readFileSync("./jwtRS256.key");

const { Users } = require("../connect.js");

module.exports = {
    login: async (email, password) => {
        let result = {
            message: null,
            status: null,
            data: null,
        }

        const findEmail = await Users.findOne({ where: { email: email } });

        console.log("Find Email: ", findEmail);

        if (!findEmail) {
            result.message = `${email} doesn't exist.`;
            result.status = 400;
            return result;
        }

        const passwordVerification = await bcrypt.compare(password, findEmail.dataValues.password);

        if (!passwordVerification) {
            result.message = "You have entered the wrong password";
            result.status = 400;
            return result;
        }

        const loginData = {
            id: findEmail.dataValues.userId,
            email: findEmail.dataValues.email
        }

        const loginToken = jwt.sign(loginData, privateKey, { algorithm: "RS256", expiresIn: "1d" });

        result.data = loginToken;
        result.status = 200;
        result.message = "Your login is successful!";
        return result;
    }
}