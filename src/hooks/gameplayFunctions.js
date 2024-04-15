import React from "react";
import { MAX_NUM_GUESSES , GREATEST_POSSIBLE_NUM} from "../constants";
import MastermindApi from "../hooks/api";
import logger from "../../controllers/utils/logger";

//This function is used to calculate the number of turns remaining in the game. It will return the number of turns remaining based on the number of plays in the game object.

export const calculateRemainingTurns = (gameData ) => {
  return gameData.game ? MAX_NUM_GUESSES - gameData.game.plays : MAX_NUM_GUESSES;
}


//This function is used to handle the change of the guess input field. It checks if the guess is the correct length and if the numbers are within the correct range. If the guess is not valid, it will set an error message. If the guess is valid, it will set the guess in the gameData object and clear the error message.
export const handleGuessChange = (ev, gameData, setGameData, GREATEST_POSSIBLE_NUM) => {
  const newGuess = ev.target.value;
  const { game } = gameData;
  if (isGuessTooLong(game, newGuess)) {
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

  if(doesGuessExist(newGuess, game)){
    setGameData(prevGameData => ({
      ...prevGameData,
      error: 'Guess already exists'
    }));
    return;
  }

  setGameData(prevGameData => ({
    ...prevGameData,
    guess: newGuess.split(""),
    error: ""
  }));
};

const isGuessTooLong =(game, newGuess)=>{
  if (newGuess.length > game.difficulty || isNaN(newGuess)){
    return true
  }else{
    return false
  }
}

const areNumsOutOfRange =(num)=>{
  if(num > GREATEST_POSSIBLE_NUM){
    return true
  }else{
    return false
  }
}

const doesGuessExist = (newGuess, game) => {
  game.prevPlays.forEach((play) => {
    if (play.nums.join("") === newGuess) {
      return true;
    }
  });
  return false
}

// This function is used to display the previous guesses and their scores. It will return null if there are no previous guesses. Otherwise, it will map over the previous guesses and return a div with the guess and how many of the numbers were correct, and of those how many are in the correct place.

export const displayPreviousGuesses = (gameData) => {
  const { game } = gameData;
  if (!game || !game.prevPlays || game.prevPlays.length === 0) {
    return null;
  }

  return game.prevPlays.map((guess) => {
    const { nums, correctNumberCount, numbersInCorrectPlace } = guess;

    return (
      <div className='play' key={nums.join("")}>
        <p className='playDetail'>{nums}</p>
        <p className='playDetail'>Numbers Correct: {correctNumberCount}</p>
        <p className='playDetail'>Places Correct: {numbersInCorrectPlace}</p>
      </div>
    );
  });
};



export const checkAnswer = async (gameData, setGameData) => {
  const { guess, game } = gameData;
  if (isGuessCorrectLength(guess, game)) {

    const currentGame = { ...game };
    currentGame.prevPlays.unshift({nums: guess, numbersInCorrectPlace: 0, correctNumberCount: 0});
    currentGame.plays++;
    setGameData(prevGameData => ({
      ...prevGameData,
      error: "",
      game: currentGame
    }));

    try {
      const updatedGame = await MastermindApi.updateGame(currentGame._id, gameData);
      console.log(updatedGame)
      setGameData(prevGameData => ({
        ...prevGameData,
        error: "",
        game: updatedGame,
        guess: []
      }));
      logger.info(`Game with id ${game._id} was updated :: updateGame, gameController.js`)
    } catch (err) {
      logger.error(`Game with id ${game._id} was not updated :: updateGame, gameController.js - Error: ${err}`)
      
    }
  }  else {
    setGameData(prevGameData => ({
      ...prevGameData,
      error: `Must have ${game.difficulty} digits`
    }));
  }      
};

const isGuessCorrectLength = (guess, game) => {
  return guess.length === game.difficulty;
}