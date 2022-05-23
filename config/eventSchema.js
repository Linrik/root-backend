const mongoose = require("mongoose"),
      Comment = require('./commentSchema'),
      User = require('./userSchema')

const eventSchema = new mongoose.Schema({
   poster: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User
   },
   tittel: String,
   text: String,
   dateFrom: Date,
   dateTo: Date,
   image: String,
   participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: User
   }], // referanse til user
   comments: [Comment], // referanse til kommentar http://bit.ly/mongoose-schematypes
   postedAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Event", eventSchema, "event");