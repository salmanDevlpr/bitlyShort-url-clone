const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
},
    {
        timestamps: true
    }
)

const Auth = mongoose.model('auth', authSchema);
module.exports = Auth;