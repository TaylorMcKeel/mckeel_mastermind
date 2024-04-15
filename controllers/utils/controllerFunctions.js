const axios = require('axios');
const logger = require('./logger');


const GameState = Object.freeze({
  GAME_IN_PROGRESS: 0,
  GAME_OUT_OF_GUESSES: 1,
  GAME_WON: 2,
  MAX_PLAY_BEFORE_GAME_OVER: 9,
})
/*
This function is used to generate random numbers using an api.
If the api call fails, it will generate random numbers using a function.
*/

const getRandomNumbers= async(difficultyLevel)=>{
  try {
    const res = await axios.get(process.env.NUMBERS_API_URL, { params: {
      'num': difficultyLevel,
      'min': 0,
      'max': 7,
      'col': 1,
      'base': 10,
      'format': 'plain',
      'rnd': 'new'
    } });
    randomNumbers = res.data.split("\n");
    randomNumbers.pop()
    logger.info(`Random numbers were generated with api:: getRandomNumbers, controllerFunctions.js`)
    return randomNumbers;
  } catch (err) {
    logger.error(`Random numbers were not generated with api, instead generated with function:: getRandomNumbers, controllerFunctions.js - Error: ${err}`)
    return createRandomNumbers(difficultyLevel);
  }
  
}

const createRandomNumbers = (difficultyLevel) => {
  const generatedNumbers = [];
  for (let i = 0; i < difficultyLevel; i++) {
    generatedNumbers.push(Math.floor(Math.random() * 7));
  }
  return generatedNumbers;
}

/*
Game Data is an object that contains the game object and the guess array. 
The game object contains the numbers array, plays, prevPlays, and gameState. 
The guess array contains the numbers that the user has guessed.
*/

/*
This function is used to update the game state.
*/
const updateGameState =  (gameData) => {
  const { guess, game } = gameData;
  if (isGuessCorrect(guess, game.numbers)) {
    return GameState.GAME_WON;
  } else if (game.plays > MAX_PLAY_BEFORE_GAME_OVER) {
    return GameState.GAME_OUT_OF_GUESSES;
  } 
  return GameState.GAME_IN_PROGRESS;
};

const isGuessCorrect = (guess, numbers) => {
  return guess.join("") === numbers.join("");
}

/*
this function is used to update the previous plays array in the game object.
*/

const updatePrevPlays = (gameData)=>{
  const {  game } = gameData;
  const numbersMap = createNumbersMap(game);
  const playedNumbers = game.prevPlays[0].nums;
  const { correctNumberCount, numbersInCorrectPlace } = determineHowCorrect(playedNumbers, game, numbersMap); 
  game.prevPlays[0].correctNumberCount = correctNumberCount;
  game.prevPlays[0].numbersInCorrectPlace = numbersInCorrectPlace;
  return game;
}
/*
This function is used to create a map of the numbers in the correct answer. 
It will return an object with the numbers as keys and the number of times they appear in the correct answer as values.
*/
const createNumbersMap = (game) => {
  return game.numbers.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});
};
/*
This function is used to determine how correct a guess is. '
It will return an object with how many correct numbers and how many numbers are in the correct place.
*/
const determineHowCorrect = (play, game, numbersMap) => {
  let correctNumberCount = 0;
  let numbersInCorrectPlace = 0;

  for (let i = 0; i < play.length; i++) {
    if (numbersMap[play[i]] && numbersMap[play[i]] > 0) {
      correctNumberCount++;
      numbersMap[play[i]]--;

      if (play[i] === game.numbers[i]) {
        numbersInCorrectPlace++;
      }
    }
  }

  return { correctNumberCount, numbersInCorrectPlace };
};


module.exports = { getRandomNumbers, updateGameState, updatePrevPlays }