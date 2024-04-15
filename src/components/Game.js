import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {  GAMES_API_ENDPOINT, GREATEST_POSSIBLE_NUM } from "../constants";
import MastermindApi from "../hooks/api";
import {handleGuessChange, displayPreviousGuesses, calculateRemainingTurns, checkAnswer} from "../hooks/gameplayFunctions";


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
  /*
  This useEffect hook is used to fetch the initial game from the database. 
  It will run once when the component is mounted.
 */

  useEffect(() => {
    const getInitialGame = async () => {
      try {
        const gameId = localStorage.getItem('gameId');
        const retrievedGame = await MastermindApi.getGame(gameId);
        setGameData(prevGameData => ({
          ...prevGameData,
          game: retrievedGame
        }));
        console.log('Initial game was fetched :: getInitialGame, Game.js');
      } catch (err) {
        console.error(`Initial game was not fetched :: getInitialGame, Game.js - Error: ${err} `);
      }
    };

    getInitialGame();
  }, []);

/*
This function is used to delete the current game from the database.
*/
  const deleteCurrentGame = async () => {
    try {
      await axios.delete(GAMES_API_ENDPOINT);
      console.log('Game was deleted :: deleteCurrentGame, Game.js');
    } catch (err) {
      console.error('Game was not deleted :: deleteCurrentGame, Game.js - Error: ${err}');
    }
  };

  const navigateHome = async () => {
    try {
      await deleteCurrentGame();
      navigate('/');
      console.log('Navigated to home :: navigateHome, Game.js');
    } catch (err) {
      console.error('Could not navigate to home :: navigateHome, Game.js - Error: ${err}');
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