const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Contact = new Schema(
    {
        nameContact: { type: String },
        emailContact: { type: String },
        phoneContact: { type: String },
        contentContact: { type: String },
    },
    { timestamps: true },
    { collection: 'contacts' },
);
module.exports = mongoose.model('contacts', Contact);
