const mongoose = require("mongoose"),
      Comment = require('./commentSchema'),
      User = require('./userSchema')

const eventSchema = new mongoose.Schema({
   poster: User,
   tittel: String,
   text: String,
   dateFrom: Date,
   dateHourFrom: Number, 
   dateTo: Date,
   dateHourTo: Number,
   bilde: [String],
   participants: [User],
   comments: [Comment]
})

module.exports = mongoose.model("Event", eventSchema, "event");