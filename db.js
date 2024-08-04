const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL = process.env.mongoDB_URL_LOCAL;
// const mongoURL = process.env.mongoDB_URL;

mongoose.connect(mongoURL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;

db.on('connected',()=>{
    console.log("Connected to mongoDB server");
});
db.on('error',(err)=>{
    console.log("Error connecting to mongoDB server: ", err);
});
db.on('disconnected',()=>{
    console.log("Disconnected to mongoDB server");
});

module.exports = db;
