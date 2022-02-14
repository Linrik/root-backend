const mongoose = require("mongoose"),
      bcrypt = require('bcrypt'),
      saltRounds = 10;

const brukerSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false //kommer ikke med på vanlige spørringer med mindru du ber om den
    },
    role: [String]
})

brukerSchema.pre('save', function (next) {
    bcrypt.hash(this.password, saltRounds, (err, hash) => {
        this.password = hash;
        next();
    })
    
});

module.exports = mongoose.model("Bruker", brukerSchema, "bruker");