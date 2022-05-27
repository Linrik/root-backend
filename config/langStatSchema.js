const mongoose = require("mongoose")

const langStatSchema = new mongoose.Schema({
    language: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    languagename: {
        type: String,
        unique: true,
        required: true
    },
    translate: {
        type: Object,
        required: true
    }
})

module.exports = mongoose.model("Lang", langStatSchema, "langstatic");