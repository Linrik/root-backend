const mongoose = require("mongoose")

const langStatSchema = new mongoose.Schema({
    languague: {
        type: String,
        unique: true
    },
    translate: Object
})

module.exports = mongoose.model("Lang", langStatSchema, "langstatic");