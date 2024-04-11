const Game = require('../models/Game')
const { getRandomNumbers, updateGameState, updatePrevPlays }= require('./utils/controllerFunctions')

const getGame = async(req,res,next)=>{
  try {
    const result = await Game.findById(req.params.gameId)
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
    const newGame = req.body
    newGame.numbers = await getRandomNumbers(newGame.difficulty)
    const result = await Game.create(newGame)

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
    const gameData = req.body
    gameData.game.gameState = await updateGameState(gameData)
    const updatedGame = await updatePrevPlays(gameData)
    const result = await Game.findByIdAndUpdate(req.params.gameId, updatedGame, {new: true})
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