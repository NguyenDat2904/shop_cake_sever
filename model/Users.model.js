const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phone: { type: String },
        address: { type: String },
        age: { type: Number },
        role: { type: String },
        status: { type: Boolean },
        refreshToken: { type: String },
        img: { type: String },
        gender: { type: String },
        code_security: { type: String },
    },
    { timestamps: true },
    { collection: 'users' },
);
module.exports = mongoose.model('users', User);
