const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    qr_id: {
        type: String,
        required: true, 
    },
    long_url: {
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
    qrScanCount: {
        type: Number,
        required: true,
        default: 0,
    },
    date: {
        type: String,
        default: Date.now,
    },
}, {
    timestamps: true
  }
)

const QrCodeModel = mongoose.model('qrcodeshorten', urlSchema);
module.exports = QrCodeModel;