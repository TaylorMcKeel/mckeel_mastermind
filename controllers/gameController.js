const Game = require('../models/Game')


const getGame = async(req,res,next)=>{
  try {
    const result = await Game.find({})
    res
    .status(200)
    .setHeader('Content-Type','application/json')
    .json(result)
  } catch (err) {
    next(err)
  }
}


const createGame = async(req,res,next)=>{
  try {
    const result = await Game.create(req.body)
    res
    .status(201)
    .setHeader('Content-Type','application/json')
    .json(result)
  } catch (err) {
    next(err)
  }
}

const updateGame = async(req,res,next)=>{
  try {
    const result = await Game.findByIdAndUpdate(req.params.gameId, req.body, {new: true})
    res
    .status(200)
    .setHeader('Content-Type','application/json')
    .json(result)
  } catch (err) {
    next(err)
  }
}


const deleteGame = async(req,res,next)=>{
  try {
    const result = await Game.deleteMany()
    res
    .status(204)
    .setHeader('Content-Type','applcation/json')
    .json(result)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getGame,
  createGame,
  updateGame,
  deleteGame
}