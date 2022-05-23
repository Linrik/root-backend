const mongoose = require("mongoose"),
      User = require('./userSchema')

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
     },
    comment: String,
    reply: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: this
    }],// lagrer id til andre kommentarer som svarer på kommentaren
    postedAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Comment", commentSchema, "comment");