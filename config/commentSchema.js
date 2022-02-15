const mongoose = require("mongoose"),
      User = require('./userSchema')

const commentSchema = new mongoose.Schema({
    user: User,
    comment: String,
    reply: commentSchema
})

module.exports = mongoose.model("Comment", commentSchema, "comment");