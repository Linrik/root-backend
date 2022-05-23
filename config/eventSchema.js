const mongoose = require("mongoose"),
      Comment = require('./commentSchema'),
      User = require('./userSchema')

const eventSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User
   },
   title: String,
   description: String,
   dateFrom: Date,
   dateTo: Date,
   image: String,
   participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: User
   }], // referanse til user
   comments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: Comment
   }],
   postedAt: {type: Date, default: Date.now}// tiden lagres på utc ikke utc+2
})

module.exports = mongoose.model("Event", eventSchema, "event");