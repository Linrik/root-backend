const mongoose = require("mongoose")
      

const loggerSchema = new mongoose.Schema({
    log: Object,
    postedAtDB: {type: Date, default: Date.now},
    expires: {type: Date, expires: 172800} // loggen forsvinner etter 2 dager
})

module.exports = mongoose.model("logger", loggerSchema, "logger");