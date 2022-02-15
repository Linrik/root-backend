const mongoose = require("mongoose"),
      Comment = require('./commentSchema'),
      User = require('./userSchema')

const eventSchema = new mongoose.Schema({
   tittel: String,
   text: String,
   participants: [User],
   comments: [Comment]
})

module.exports = mongoose.model("Event", eventSchema, "event");