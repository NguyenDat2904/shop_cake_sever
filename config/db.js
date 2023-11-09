require('dotenv').config();
const mongoose = require('mongoose');
function ConnectMongo() {
    mongoose
        .connect(process.env.MONGO_CONNECT)
        .then(() => console.log('Connected Mongo!'))
        .catch((err) => console.log(err));
}
module.exports = ConnectMongo;
