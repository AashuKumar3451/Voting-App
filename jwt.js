const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtAuthMiddleware = function(req,res,next){
    if(!req.headers.authorization){
        res.status(401).json("Invalid Token");
    }
    // Extract jwt token given by user
    const token = req.headers.authorization.split(' ')[1];
    if(!token){return res.status(401).json("Unauthorized");}
    try {
        const decoded = jwt.verify(token,process.env.JWT_Secret_Key);
        req.userPayload = decoded;
        next();
    } catch (error) {
        console.log("Error");
        res.status(401).json({error: 'Invalid token'});
    }
}

const generateJWT = function(userData){
    return jwt.sign(userData,process.env.JWT_Secret_Key);
}

module.exports = {jwtAuthMiddleware, generateJWT};