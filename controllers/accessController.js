const registerService = require("../services/registerService.js");
const loginService = require("../services/loginService.js");

class accessController {
    async register (req, res) {
        if (req.body.password === undefined || req.body.password === null) {
            res.status(400)
            return res.send("Your password is invalid.");
        }

        // check if password used is longer than 72 bytes long
        // bcrypt 5.0.1 limitations, only 1st 72 bytes of string are used in hashing
        let checkLength = new TextEncoder().encode(req.body.password).length;
        console.log("Checking byte length: ", checkLength);

        if (checkLength > 72) {
            res.status(400)
            return res.send("You have entered an invalid password.");
        }

        console.log("Registration Details: ", req.body);
        const result = await registerService.register(req.body.email, req.body.username, req.body.password);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    }

    async login (req, res) {
        if (req.body.email === undefined || req.body.email === null) {
            res.status(400)
            return res.send("Your email is invalid.");
        }

        if (req.body.password === undefined || req.body.password === null) {
            res.status(400)
            return res.send("Your password is invalid.");
        }

        console.log("Login Details: ", req.body);
        const result = await loginService.login(req.body.email, req.body.password);
        res.status(result.status);
        return res.json({ data: result.data, message: result.message });
    }
}

module.exports = accessController;