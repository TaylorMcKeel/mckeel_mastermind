import React from "react";
import { MAX_NUM_GUESSES , GREATEST_POSSIBLE_NUM} from "../constants";

//This function is used to calculate the number of turns remaining in the game. It will return the number of turns remaining based on the number of plays in the game object.

export const calculateRemainingTurns = (gameData ) => {
  return gameData.game ? MAX_NUM_GUESSES - gameData.game.plays : MAX_NUM_GUESSES;
}


//This function is used to handle the change of the guess input field. It checks if the guess is the correct length and if the numbers are within the correct range. If the guess is not valid, it will set an error message. If the guess is valid, it will set the guess in the gameData object and clear the error message.
export const handleGuessChange = (ev, gameData, setGameData, GREATEST_POSSIBLE_NUM) => {
  const newGuess = ev.target.value;
  const { game } = gameData;
  if (!isGuessCorrectLength(game, newGuess)) {
    setGameData(prevGameData => ({
      ...prevGameData,
      error: `Guess must be ${game.difficulty} numbers`
    }));
    return;
  }

  for (let i = 0; i < newGuess.length; i++) {
    if (areNumsOutOfRange(newGuess[i])) {
      setGameData(prevGameData => ({
        ...prevGameData,
        error: 'Number must be between 0-7'
      }));
      return;
    }
  }

  setGameData(prevGameData => ({
    ...prevGameData,
    guess: newGuess.split(""),
    error: ""
  }));
};

const isGuessCorrectLength =(game, newGuess)=>{
  if (newGuess.length > game.difficulty || isNaN(newGuess)){
    return false
  }else{
    return true
  }
}

const areNumsOutOfRange =(num)=>{
  if(num > GREATEST_POSSIBLE_NUM){
    return true
  }else{
    return false
  }
}

// This function is used to display the previous guesses and their scores. It will return null if there are no previous guesses. Otherwise, it will map over the previous guesses and return a div with the guess and how many of the numbers were correct, and of those how many are in the correct place.

export const displayPreviousGuesses = (gameData) => {
  const { game } = gameData;
  if (!game || !game.prevPlays || game.prevPlays.length === 0) {
    return null;
  }

  return game.prevPlays.slice().reverse().map((numbersPlayed) => {
    const numbersMap = createNumbersMap(game);
    const { correctNumberCount, numbersInCorrectPlace } = determineHowCorrect(numbersPlayed, game, numbersMap);

    return (
      <div className='play' key={numbersPlayed.join("")}>
        <p className='playDetail'>{numbersPlayed}</p>
        <p className='playDetail'>Numbers Correct: {correctNumberCount}</p>
        <p className='playDetail'>Places Correct: {numbersInCorrectPlace}</p>
      </div>
    );
  });
};

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

