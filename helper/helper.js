const jwt = require("jsonwebtoken");


const generateAuthToken = function (payload,secret) {
    const token = jwt.sign(payload,secret);
    return token;
}

helperObj = {};
helperObj.generateAuthToken = generateAuthToken;

module.exports = helperObj;



