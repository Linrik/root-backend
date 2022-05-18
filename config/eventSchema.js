const mongoose = require("mongoose"),
      Comment = require('./commentSchema'),
      User = require('./userSchema')

const eventSchema = new mongoose.Schema({
   posterid: String,
   postername: String,
   tittel: String,
   text: [{
      type: Map,
      of: String
   }],
   dateFrom: Date,
   dateHourFrom: Number, 
   dateTo: Date,
   dateHourTo: Number,
   bilde: [String],
   participants: [String], // referanse til user
   comments: [Comment] // referanse til kommentar http://bit.ly/mongoose-schematypes
})

module.exports = mongoose.model("Event", eventSchema, "event");