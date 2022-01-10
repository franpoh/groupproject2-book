const jwt = require("jsonwebtoken"); // Import
const fs = require("fs"); 
const privateKey = fs.readFileSync("./jwtRS256.key"); 

const token = process.argv[2]; 

// Decrypt the given token
jwt.verify(token, privateKey, {algorithms:["RS256"]}, function(err, decoded){
    if(err){
        console.error(err); 
        return null;
    }

    console.log (decoded); 
});