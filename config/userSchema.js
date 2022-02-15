const mongoose = require("mongoose"),
      bcrypt = require('bcrypt'),
      saltRounds = 10;
//laget UserSchema
const userSchema = new mongoose.Schema({
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
    rootMember: Boolean,
    admin: Boolean
})

// hasher passordet før det blir lagret
userSchema.pre('save', function (next) {
    bcrypt.hash(this.password, saltRounds, (err, hash) => {
        this.password = hash;
        this.rootMember = false;
        this.admin = false;
        next();
    })
    
});

module.exports = mongoose.model("Bruker", userSchema, "bruker");