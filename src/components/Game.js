import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {  GAMES_API_ENDPOINT, GREATEST_POSSIBLE_NUM } from "../constants";
import MastermindApi from "../hooks/api";
import {handleGuessChange, displayPreviousGuesses, calculateRemainingTurns, checkAnswer} from "../hooks/gameplayFunctions";
import logger from "../../controllers/utils/logger";


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
        logger.info('Initial game was fetched :: getInitialGame, Game.js');
      } catch (err) {
        logger.error(`Initial game was not fetched :: getInitialGame, Game.js - Error: ${err} `);
      }
    };

    getInitialGame();
  }, []);


  const deleteCurrentGame = async () => {
    try {
      await axios.delete(GAMES_API_ENDPOINT);
      logger.info('Game was deleted :: deleteCurrentGame, Game.js');
    } catch (err) {
      logger.error('Game was not deleted :: deleteCurrentGame, Game.js - Error: ${err}');
    }
  };

  const navigateHome = async () => {
    try {
      await deleteCurrentGame();
      navigate('/');
      logger.info('Navigated to home :: navigateHome, Game.js');
    } catch (err) {
      logger.error('Could not navigate to home :: navigateHome, Game.js - Error: ${err}');
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
                checkAnswer(gameData, setGameData);
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