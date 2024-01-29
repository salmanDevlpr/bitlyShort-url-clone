const Auth = require('../models/authModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const getLoginUsers = async (req, res) => {
    try {
        const userData = await Auth.find({}, {username: 1, email: 1});
        res.status(200).json(userData)
    } catch (error) {
        res.send(500).json({msg: error.message})
       console.log('error in fetching users', error.message); 
    }
}

const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
    
        if(!(username && email && password)) {
            res.status(400).json({message: 'All field are mandatory..'})
        }
        const user = await Auth.findOne({ email });
        if(user){
            return res.status(200).json({message: 'User already registered', success: false})
        }
        
        const salt = await bcrypt.genSalt(10);
        const hassedPassword = await bcrypt.hash(password, salt);
        const result = await Auth.create({
            username, 
            email,
            password: hassedPassword
        })
    
        return res.status(201).json({
            message: 'User Register successfully',
            success: true,
            result,
        })
    } catch (error) {
        console.log('error in register', error);
        return res.status(403).json({message: error.message})
    }
}

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Auth.findOne({ email });
        if(!user){
            return res.status(200).json({message: 'User not found', success: false})
        }
        const matchedPassword = await bcrypt.compare(password, user.password);
        if(!matchedPassword){
            return res.status(200).json({message: 'Invalid email or password', success: false});
        }
        
        const userId = {
            id:user._id
        }

        const token = jwt.sign(userId, process.env.SECRET_TOKEN_KEY, {expiresIn: '1d'}) 
        console.log('token', token);
        user.token = token;
        user.password = undefined;
        res.cookie('jwt', token)
        
        return res.status(200).json({
            message: 'User login successfull',
            success: true,
            token
        })
    } catch (error) {
        console.log('error in login', error);
        return res.status(403).json({message: error.message})
    }
}


const logoutController = async(req, res) => {
    console.log('req.user', req.user);
    await Auth.findByIdAndUpdate(req.user.id);

    return res.status(200).clearCookie('jwt').json({messge: 'user logout successfully'});
}


module.exports = {
    getLoginUsers,
    registerController,
    loginController,
    logoutController
}