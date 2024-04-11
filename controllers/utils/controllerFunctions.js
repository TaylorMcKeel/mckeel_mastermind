const axios = require('axios');

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
    return randomNumbers;
  } catch (err) {
    console.log(err);
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




const updateGameState = async (gameData) => {
  const { guess, game } = gameData;
  if (isGuessCorrect(guess, game.numbers)) {
    game.gameState = 2
  } else if (game.plays > 9) {
    game.gameState = 1
  } 
  return game;
};

const isGuessCorrect = (guess, numbers) => {
  return guess.join("") === numbers.join("");
}


module.exports = { getRandomNumbers, updateGameState }