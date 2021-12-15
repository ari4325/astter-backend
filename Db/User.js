const mongoose = require('mongoose')
const socialItem = require('./SocialItem').schema

const user = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    address: {
        type:String, 
        required: true
    }, 
    img: {
        type: String,
    },
    items: [socialItem],
    following: [],
    follower: []
});

module.exports = mongoose.model('user', user)