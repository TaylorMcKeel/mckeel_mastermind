const mongoose = require('mongoose')
const Schema = mongoose.Schema

const GameSchema = new Schema({
  numbers:{
    type: Array,
    required: true
  },
  plays:{
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  prevPlays:{
    type: Array,
    required: true
  },
  difficulty:{
    type: Number,
    required: true
  }
},{
  timestamps: true
})

module.exports = mongoose.model('Game', GameSchema)