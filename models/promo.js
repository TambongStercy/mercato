const mongoose = require("mongoose");

const promoSchema = new mongoose.Schema({
    code:{
        type: String,
    },
});

const Promo = mongoose.model('Promo', promoSchema);

module.exports = Promo;