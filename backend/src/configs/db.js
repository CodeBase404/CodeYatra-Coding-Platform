const mongoose = require("mongoose");

async function connectToDb(){
    await mongoose.connect(process.env.MONGODB_CONNECT);
}

module.exports = connectToDb;