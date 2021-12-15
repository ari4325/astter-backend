const express = require('express');
const connectDB = require('./Db/Connection');
const user_api = require('./route/user_api');

connectDB();
const port = process.env.Port || 8080;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/user', user_api);

app.listen(port, (err) => {
    if(err == null){
        console.log("Started...on Port: "+port);
    }else{
        console.log( { message:err } );
    }
})
