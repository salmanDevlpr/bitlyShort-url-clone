const jwt = require('jsonwebtoken');
require('dotenv').config();
const Auth = require('../models/authModel');

module.exports = async (req, res, next) => {
    try {
        const authHeaders = req.headers['authorization']
        const token = authHeaders && authHeaders.split(' ')[1];
        console.log('token', token);
        if(!token){
            return res.status(401).json({message: 'Unauthorized token'})
        }
        const decodedToken = jwt.verify(token,process.env.SECRET_TOKEN_KEY);
        const user = await Auth.findById(decodedToken?.id).select("-password");
        if(!user){
            return res.status(401).json({message: 'Invalid access token'});
        }
        req.user = user;
        next();
    } catch (error) {
        console.log('error in authmiddleware', error.message);
        res.status(500).json({message: error.message});
    }
}