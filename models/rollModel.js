const mongoose = require("mongoose")

const rollSchema = new mongoose.Schema({
  user: {type: String, required: true},
  roll: {type: Number, required: true},
  total: {type: Number, required: true},
  date: {type: String, required: true},
})

module.exports =  mongoose.model("rollModel", rollSchema)