
const Constants = {

    // user type constants
    USER_BANNED: "BANNED",
    USER_USER: "USER",
    USER_ADMIN: "ADMIN",

    // swap availablity
    AVAIL_YES: "YES",
    AVAIL_NO: "NO",
    // reserved for further dev
    AVAIL_RESERVED: "RESERVED",
    AVAIL_COLLECTED: "COLLECTED",

    // JWT tokens
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",

    // Account error messages
    EMAIL_INVALID: "Your email is invalid.",
    PASSWORD_INVALID: "Your password is invalid.",
    USER_INVALID: "Your username is invalid",
    GENERAL_INVALID: "Please fill in all blanks.",

    EMAIL_INUSE: "Your email is in use.",
    USER_INUSE: "Your username is in use.",

    PASSWORD_CHARS: "Your password must contain at least 5 chars.",
    USER_CHARS: "Your username must contain between 3 to 10 chars.",
}

module.exports = Constants;