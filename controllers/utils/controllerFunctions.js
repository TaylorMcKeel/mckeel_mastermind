export const getRandomNumbers= async(difficultyLevel)=>{
  try {
    const res = await axios.get(NUMBERS_API, { params: {
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




export const checkAnswer = async (gameData) => {
  const { guess, game } = gameData;

  if (guess.length === game.difficulty) {
    setGameData(prevGameData => ({
      ...prevGameData,
      error: ""
    }));

    const updatedGame = { ...game };
    updatedGame.prevPlays.push(guess);
    updatedGame.plays++;

    try {
      await axios.put(`${GAMES_API_ENDPOINT}/${updatedGame._id}`, updatedGame);

      if (guess.join("") === updatedGame.numbers.join("")) {
        setGameData(prevGameData => ({
          ...prevGameData,
          gameOverCount: 2
        }));
      } else if (updatedGame.plays > 9) {
        setGameData(prevGameData => ({
          ...prevGameData,
          gameOverCount: 1
        }));
      } else {
        setGameData(prevGameData => ({
          ...prevGameData,
          game: updatedGame,
          guess: []
        }));
      }
    } catch (err) {
      console.log("Error updating game:", err);
    }
  } else {
    setGameData(prevGameData => ({
      ...prevGameData,
      error: `Must have ${game.difficulty} digits`
    }));
  }
};


