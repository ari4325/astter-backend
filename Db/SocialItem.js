const mongoose = require('mongoose');

const social = new mongoose.Schema({
    owner_address: {
        type: String,
    },
    name: {
        type: String,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    img_url: {
        type: String,
    }
});

module.exports = mongoose.model('socialItem', social);