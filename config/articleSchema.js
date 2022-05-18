const mongoose = require("mongoose"),
      Comment = require('./commentSchema'),
      User = require('./userSchema')

const articleSchema = new mongoose.Schema({
   poster: User,
   tittel: String,
   text: String,
   bilde: [String],
   comments: [Comment]
})

module.exports = mongoose.model("Article", articleSchema, "artivle");