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




const updateGameState =  (gameData) => {
  const { guess, game } = gameData;
  if (isGuessCorrect(guess, game.numbers)) {
    return 2
  } else if (game.plays > 9) {
    return 1
  } 
  return 0;
};

const isGuessCorrect = (guess, numbers) => {
  return guess.join("") === numbers.join("");
}



const updatePrevPlays = (gameData)=>{
  const {  game } = gameData;
  const numbersMap = createNumbersMap(game);
  const playedNumbers = game.prevPlays[0].nums;
  const { correctNumberCount, numbersInCorrectPlace } = determineHowCorrect(playedNumbers, game, numbersMap); 
  game.prevPlays[0].correctNumberCount = correctNumberCount;
  game.prevPlays[0].numbersInCorrectPlace = numbersInCorrectPlace;
  return game;
}

//This function is used to create a map of the numbers in the correct answer. It will return an object with the numbers as keys and the number of times they appear in the correct answer as values.
const createNumbersMap = (game) => {
  return game.numbers.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});
};

//This function is used to determine how correct a guess is. It will return an object with how many correct numbers and how many numbers are in the correct place.
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