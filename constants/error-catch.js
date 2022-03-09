function validEmail(email) {
    const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(String(email).toLowerCase());
}

function pwdByteLen(pwd) {
    return new TextEncoder().encode(pwd).length
}

function controlErrorCatch(res, error, msg, status) {
    if (error) {
        return res.status(status).json({ message: msg });
    }
}

// might mess up the order of some error checking
function serviceErrorCatch(res, error, msg, status) {
    if (error) {
        res.status = status;
        res.message = msg;
        return res;
    }
}

module.exports = {
    validEmail,
    controlErrorCatch,
    serviceErrorCatch,
    pwdByteLen,
}
