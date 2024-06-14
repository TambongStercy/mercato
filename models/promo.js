const mongoose = require("mongoose");

const promoSchema = new mongoose.Schema({
    code:{
        type: String,
    },
    name:{
        type: String,
    },
    balance:{
        type: Number,
        default: 0,
    }
});

const Promo = mongoose.model('Promo', promoSchema);

module.exports = Promo;