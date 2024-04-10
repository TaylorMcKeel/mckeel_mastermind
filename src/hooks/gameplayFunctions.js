import React from "react";
import { MAX_NUM_GUESSES } from "../constants";


export const calculateRemainingTurns = (gameData ) => {
  return gameData.game ? MAX_NUM_GUESSES - gameData.game.plays : MAX_NUM_GUESSES;
}


//This function is used to handle the change of the guess input field. It checks if the guess is the correct length and if the numbers are within the correct range. If the guess is not valid, it will set an error message. If the guess is valid, it will set the guess in the gameData object and clear the error message.
export const handleGuessChange = (ev, gameData, setGameData, GREATEST_POSSIBLE_NUM) => {
  const newGuess = ev.target.value;
  console.log(ev)
  const { game } = gameData;
  console.log(newGuess, game)
  if (newGuess.length > game.difficulty || isNaN(newGuess)) {
    setGameData(prevGameData => ({
      ...prevGameData,
      error: `Guess must be ${game.difficulty} numbers`
    }));
    return;
  }

  for (let i = 0; i < newGuess.length; i++) {
    if ( newGuess[i] > GREATEST_POSSIBLE_NUM) {
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

// This function is used to display the previous guesses and their scores. It will return null if there are no previous guesses. Otherwise, it will map over the previous guesses and return a div with the guess and the number of numbers and places that were correct.

export const displayPreviousGuesses = (gameData) => {
  const { game } = gameData;
  if (!game || !game.prevPlays || game.prevPlays.length === 0) {
    return null;
  }

  return game.prevPlays.slice().reverse().map((play) => {
    const numbersMap = createNumbersMap(game);
    const { correctNumberCount, numbersInCorrectPlace } = determineHowCorrect(play, game, numbersMap);

    return (
      <div className='play' key={play.join("")}>
        <p className='playDetail'>{play}</p>
        <p className='playDetail'>Numbers Correct: {correctNumberCount}</p>
        <p className='playDetail'>Places Correct: {numbersInCorrectPlace}</p>
      </div>
    );
  });
};

const createNumbersMap = (game) => {
  return game.numbers.reduce((acc, curr) => {
    acc[curr] = (acc[curr] || 0) + 1;
    return acc;
  }, {});
};

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

