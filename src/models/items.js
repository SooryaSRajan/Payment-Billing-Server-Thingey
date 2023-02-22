const mongoose = require("mongoose");

const Item = new mongoose.Schema({
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vendor',
        required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
        type: Number,
        required: true,
    },
  });

module.exports = mongoose.model('Item', Item);