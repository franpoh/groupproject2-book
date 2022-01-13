const registerService = require("../services/registerService.js");
const loginService = require("../services/loginService.js");

class accessController {
    async register (req, res) {
        // check if password used is longer than 72 bytes long
        // bcrypt 5.0.1 limitations, only 1st 72 bytes of string are used in hashing
        let checkLength = new TextEncoder().encode(req.body.password).length;
        console.log("Checking byte length: ", checkLength);

        if (!req.body.password || checkLength > 72 || req.body.password.length < 5) {
            res.status(400)
            return res.send("Your password is invalid. Please ensure that it contains at least 5 characters.");
        }

        const result = await registerService.register(req.body.email, req.body.username, req.body.password);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    }

    async login (req, res) {
        if (!req.body.email) {
            res.status(400)
            return res.send("Your email is invalid.");
        }

        if (!req.body.password) {
            res.status(400)
            return res.send("Your password is invalid.");
        }

        const result = await loginService.login(req.body.email, req.body.password);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    }
}

module.exports = accessController;