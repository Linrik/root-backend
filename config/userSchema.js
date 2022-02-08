const mongoose = require("mongoose"),
      bcrypt = require('bcrypt'),
      saltRounds = 10;

const brukerSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false //kommer ikke med på vanlige spørringer med mindru du ber om den
    }
})

brukerSchema.pre('save', function (next) {
    bcrypt.hash(this.password, saltRounds, (err, hash) => {
        console.log(hash)
        this.password = hash;
        next();
    })   
});

brukerSchema.statics.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.passord, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model("Bruker", brukerSchema, "bruker");