const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    imageUrl: {
        type: String,
    },
    cloudinaryId: {
        type: String,
    },
}, {timestamps: true})

const ImageModel = mongoose.model('Image', imageSchema);
module.exports = ImageModel;