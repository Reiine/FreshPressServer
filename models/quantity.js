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
        type: {
            day: {
                type: Number,
            },
            month: {
                type: Number,
            },
            year: {
                type: Number,
            }
        }
    }
});

quantitySchema.pre('save', function(next) {
    const currentDate = new Date();
    this.date = {
        day: currentDate.getDate(),
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear()
    };
    next();
});

const quantity = mongoose.model('quantity', quantitySchema);

module.exports = quantity;
