import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {  GAMES_API_ENDPOINT, GREATEST_POSSIBLE_NUM } from "../constants";
import MastermindApi from "../hooks/api";
import {handleGuessChange, displayPreviousGuesses, calculateRemainingTurns} from "../hooks/gameplayFunctions";


const Game = () => {
  const initialGameData = {
    game: {},
    guess: [],
    error: ""
  };

  const [gameData, setGameData] = useState(initialGameData);
  const navigate = useNavigate();

  const GameState = Object.freeze({
    GAME_IN_PROGRESS: 0,
    GAME_OUT_OF_GUESSES: 1,
    GAME_WON: 2
  })

  const numberOfTurnsRemaining = calculateRemainingTurns(gameData)

  useEffect(() => {
    const getInitialGame = async () => {
      try {
        const gameId = localStorage.getItem('gameId');
        const retrievedGame = await MastermindApi.getGame(gameId);
        setGameData(prevGameData => ({
          ...prevGameData,
          game: retrievedGame
        }));
      } catch (error) {
        console.log("Error fetching initial game:", error);
      }
    };

    getInitialGame();
  }, []);

  const checkAnswer = async () => {
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

  

  const deleteCurrentGame = async () => {
    try {
      await axios.delete(GAMES_API_ENDPOINT);
      console.log("Game was deleted from the database");
    } catch (err) {
      console.log("Error deleting game:", err);
    }
  };

  const navigateHome = async () => {
    try {
      await deleteCurrentGame();
      navigate('/');
    } catch (err) {
      console.log("Error navigating home:", err);
    }
  };

  return (
    <>
      {gameData.game.gameState === GameState.GAME_OUT_OF_GUESSES && (
        <div className='textAndButton'>
          <h1>Game Over</h1>
          <button onClick={navigateHome}>Play Again</button>
        </div>
      )}
      {gameData.game.gameState === GameState.GAME_WON && (
        <div className="animated-background">
          <h1>YOU WIN</h1>
          <button onClick={navigateHome}>Play Again</button>
        </div>
      )}
      {gameData.game.gameState === GameState.GAME_IN_PROGRESS && gameData.game && (
        <div id='gamePlay'>
          <p>You have {numberOfTurnsRemaining} turns remaining</p>
          <form>
            <input
              type="text"
              id="guess"
              value={gameData.guess.join("")}
              name="guess"
              onChange={(ev) => handleGuessChange(ev, gameData, setGameData, GREATEST_POSSIBLE_NUM)}
            />
            <p id='error'>{gameData.error}</p>
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                checkAnswer();
              }}
            >
              Submit
            </button>
          </form>

          <ul id='prevPlays'>{displayPreviousGuesses(gameData, setGameData)}</ul>
        </div>
      )}
    </>
  );
};

export default Game;