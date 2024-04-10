const express = require('express')
const router = express.Router()


const {  
  getGame,
  createGame,
  updateGame,
  deleteGame
} = require('../controllers/gameController')

router.route('/')
  .post(createGame)
  .delete(deleteGame)

router.route('/:gameId')
  .get(getGame)
  .put(updateGame)


module.exports = router