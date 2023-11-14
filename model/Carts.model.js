const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Cart = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
        },
        product: [
            {
                id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products',
                },
                quantity: { type: Number },
            },
        ],
    },
    { timestamps: true },
    { collection: 'carts' },
);
module.exports = mongoose.model('carts', Cart);
