const mongoose = require("mongoose"),
      User = require('./userSchema')

const commentSchema = new mongoose.Schema({
    user: [String],
    comment: String,
    reply: [String],// lagrer id til andre kommentarer som svarer på kommentaren
    postedAt: {type: Date, default: Date.now}
})

module.exports = commentSchema;