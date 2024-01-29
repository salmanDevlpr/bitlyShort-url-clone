const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    id: {
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
    title: {
        type: String,
        required: true
    },
    clicks: {
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

const UrlModel = mongoose.model('urlshorten', urlSchema);
module.exports = UrlModel;