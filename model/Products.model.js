const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Product = new Schema(
    {
        name: { type: String, required: true },
        price: { type: String, required: true },
        cost: { type: String, required: true },
        color: { type: String },
        type: { type: String },
        trend: { type: Boolean },
        img: { type: String },
        size: { type: String },
        topic: { type: String },
    },
    { timestamps: true },
    { collection: 'products' },
);
module.exports = mongoose.model('products', Product);
