const mongoose = require('mongoose');
const URI = "mongodb+srv://user1:arishmit01@cluster0.pa17a.mongodb.net/userDB?retryWrites=true&w=majority";

const connectDB = async() => {
    await mongoose.connect(URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    console.log("DB Connected...");
};

module.exports = connectDB;