const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customizeQrModel = new mongoose.Schema({
    codeHex: {
        type: String,
        required: true
    },
    bgColorHex: {
        type: String,
        required: true
    },
    imgUrl:{
        type: String
    },
    customizeId:{
        type: String
    },
},{timestamps: true})

const CustomizeQrModel = mongoose.model('CustomizeQr', customizeQrModel);
module.exports = CustomizeQrModel