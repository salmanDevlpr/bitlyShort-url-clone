const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true, 
    },
    qr_id: {
        type: String,
        required: true, 
    },
    long_url: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
    qrCodeLink: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    clicks: {
        type: Number,
        required: true,
        default: 0,
    },
    qrScanCount: {
        type: Number,
        required: true,
        default: 0,
    },
    
}, {
    timestamps: true
  }
)

const UrlModel = mongoose.model('Urlshorten', urlSchema);
module.exports = UrlModel;