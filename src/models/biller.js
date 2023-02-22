const mongoose = require("mongoose");

const Biller = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    code: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Biller', Biller);
