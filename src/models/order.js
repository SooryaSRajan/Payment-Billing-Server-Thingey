const mongoose = require("mongoose");

const Order = new mongoose.Schema({
    vendorIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
    }],
    billerCode: {
        type: Number,
        required: true,
    },
    usableId:{
        type: String,
        required: true,
    },
    items : [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        },
    }],
    totalPrice: {
        type: Number,
        required: true,
    },
    timeStamp: {
        type: Date,
        required: true,
    },
    live: {
        type: Boolean,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    rollNo:{
        type: String,
        required: false,
    }
});

module.exports = mongoose.model('Order', Order);