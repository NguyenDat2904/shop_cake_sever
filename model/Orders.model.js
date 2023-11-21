const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Order = new Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        nameBuy: { type: String },
        email: { type: String },
        phoneBuy: { type: String },
        nameReceive: { type: String },
        phoneReceive: { type: String },
        province: { type: String },
        district: { type: String },
        ward: { type: String },
        address: { type: String },
        product: [
            {
                id: {
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
