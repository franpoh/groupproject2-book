function validEmail(email) {
    const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(String(email).toLowerCase());
}

function pwdByteLen(pwd) {
    return new TextEncoder().encode(pwd).length
}

function errorCatch(error, msg) {
    if (error) {
        return res.status(400).json({ message: msg });
    }
}

module.exports = {
    validEmail,
    errorCatch,
    pwdByteLen
}
