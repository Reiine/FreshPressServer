// mongodb+srv://reiine:testpass@cluster0.u7inkuy.mongodb.net/FreshPress

const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://reiine:testpass@cluster0.u7inkuy.mongodb.net/FreshPress')
    .then((res) => {
        console.log("mongoose connected");
    })
    .catch((error) => {
        console.log("Error:", error);
    });

const quantitySchema = new mongoose.Schema({
    normalQuantity: {
        type: Number,
        required: true,
    },
    otherQuantity: {
        type: Number,
        required: true,
    },
    otherType:{
        type: Number,
        required: true,
    },
    date: {
        day: {
            type: Number,
            required: true,
        },
        month: {
            type: Number,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        }
    }
});

const quantity = mongoose.model('Quantity', quantitySchema);

module.exports = quantity;
