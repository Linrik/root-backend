const mongoose = require("mongoose"),
      Comment = require('./commentSchema'),
      User = require('./userSchema')

const articleSchema = new mongoose.Schema({
   poster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User
   },
   tittel: String,
   text: String,
   image: [String],
   comments: [Comment],
   postedAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Article", articleSchema, "article");