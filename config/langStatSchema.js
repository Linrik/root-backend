const mongoose = require("mongoose")

const langStatSchema = new mongoose.Schema({
    language: {
        type: String,
        unique: true
    },
    translate: Object
})

module.exports = mongoose.model("Lang", langStatSchema, "langstatic");