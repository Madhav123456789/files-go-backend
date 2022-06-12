const mongoose = require('mongoose');

// creating database for the app 
const connectToDb = async (Uri)=>{
    try{
        await mongoose.connect(Uri);
        console.log("connection successfull");
    }catch(e){
        console.log("db connection error --> "+e);
    }
}

module.exports = connectToDb;