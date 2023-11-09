const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Order = new Schema(
    {
        nameBuy: { type: String, required: true },
        email: { type: String, required: true },
        phoneBuy: { type: String, required: true },
        nameReceive: { type: String, required: true },
        phoneReceive: { type: String },
        province: { type: String },
        district: { type: Number },
        ward: { type: String },
        address: { type: String },
        product: [
            {
                ...{
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products',
                },
                quantity: { type: Number },
            },
        ],
        formattedTotal: { type: String },
        payIn: { type: String },
        deliveryMethod: { type: String },
    },
    { timestamps: true },
    { collection: 'orders' },
);
module.exports = mongoose.model('orders', Order);
