const Game = require('../models/Game')
const { getRandomNumbers, updateGameState, updatePrevPlays }= require('./utils/controllerFunctions')
const logger = require('./utils/logger')  


const getGame = async(req,res,next)=>{
  try {
    const result = await Game.findById(req.params.gameId)
  res
    logger.info(`Game with id ${req.params.gameId} was found :: getGame, gameController.js`)
    res
    .status(200)
    .setHeader('Content-Type','application/json')
    .json(result)
  } catch (err) {
    logger.error(`Game with id ${req.params.gameId} was not found :: getGame, gameController.js - Error: ${err}`)
    next(err)
  }
}


const createGame = async(req,res,next)=>{
  try {
    // const headerInfo=checkForHeaders(req, false)
    const newGame = req.body
    newGame.numbers = await getRandomNumbers(newGame.difficulty)
    const result = await Game.create(newGame)
    logger.info(`Game with id ${result._id} was created :: createGame, gameController.js`)
    res
    .status(201)
    .setHeader('Content-Type','application/json')
    .setHeader('Bearer',result._id)
    .json(result)
  } catch (err) {
    logger.error(`Game with id ${req.params.gameId} was not created :: createGame, gameController.js - Error: ${err}`);
    next(err)
  }
}

const updateGame = async(req,res,next)=>{
  try {
    const gameData = req.body
  
    gameData.game.gameState = await updateGameState(gameData)
    const updatedGame = await updatePrevPlays(gameData)
    const result = await Game.findByIdAndUpdate(req.params.gameId, updatedGame, {new: true})
    logger.info(`Game with id ${req.params.gameId} was updated :: updateGame, gameController.js`)  
    res
    .status(200)
    .setHeader('Content-Type','application/json')
    .json(result)
  } catch (err) {
    logger.error(`Game with id ${req.params.gameId} was not updated :: updateGame, gameController.js - Error: ${err}`)
    next(err)
  }
}


const deleteGame = async(req,res,next)=>{
  try {
    const result = await Game.deleteMany()
    logger.info(`All games were deleted :: deleteGame, gameController.js`)
    res
    .status(204)
    .setHeader('Content-Type','applcation/json')
    .json(result)
  } catch (err) {
    logger.error(`Games were not deleted :: deleteGame, gameController.js - Error: ${err}`)
    next(err)
  }
}

module.exports = {
  getGame,
  createGame,
  updateGame,
  deleteGame
}