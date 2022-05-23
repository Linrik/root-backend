const mongoose = require("mongoose"),
      Comment = require('./commentSchema'),
      User = require('./userSchema')

const articleSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User
   },
   tittel: String,
   description: String,
   image: String,
   comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: Comment
   }],
   postedAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Article", articleSchema, "article");