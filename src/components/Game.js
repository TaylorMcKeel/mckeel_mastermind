import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {  GAMES_API, MAX_GUESS_LENGTH, MAX_NUM_GUESSES } from "../constants";
import MastermindApi from "../hooks/api";
//put functions in chronological order



const Game = () => {
  const initialGameData = {
    game: {},
    guess: [],
    gameOverCount: 0,
    error: ""
  };

  const [gameData, setGameData] = useState(initialGameData);
  const navigate = useNavigate();

  const count = gameData.game?.plays ? MAX_NUM_GUESSES - gameData.game.plays : MAX_NUM_GUESSES;

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

  const handleGuessChange = (ev) => {
    const newGuess = ev.target.value;
    const { game } = gameData;

    if (!game || newGuess.length !== game.difficulty || isNaN(newGuess)) {
      setGameData(prevGameData => ({
        ...prevGameData,
        error: `Guess must be ${game.difficulty} numbers`
      }));
      return;
    }

    for (let i = 0; i < newGuess.length; i++) {
      if (newGuess[i] < 0 || newGuess[i] > MAX_GUESS_LENGTH) {
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
        await axios.put(`${GAMES_API}/${updatedGame._id}`, updatedGame);

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

  const displayPreviousGuesses = () => {
    const { game } = gameData;
    if (!game || !game.prevPlays || game.prevPlays.length === 0) {
      return null;
    }

    return game.prevPlays.slice().reverse().map((play) => {
      const checkNums = countNumbers(game);
      const { numbersRight, placesRight } = calculateScores(play, game, checkNums);

      return (
        <div className='play' key={play.join("")}>
          <p className='playDetail'>{play}</p>
          <p className='playDetail'>Numbers Correct: {numbersRight}</p>
          <p className='playDetail'>Places Correct: {placesRight}</p>
        </div>
      );
    });
  };

  const countNumbers = (game) => {
    return game.numbers.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});
  };

  const calculateScores = (play, game, checkNums) => {
    let numbersRight = 0;
    let placesRight = 0;

    for (let i = 0; i < play.length; i++) {
      if (checkNums[play[i]] && checkNums[play[i]] > 0) {
        numbersRight++;
        checkNums[play[i]]--;

        if (play[i] === game.numbers[i]) {
          placesRight++;
        }
      }
    }

    return { numbersRight, placesRight };
  };

  const deleteCurrentGame = async () => {
    try {
      await axios.delete("/api/games");
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
      {gameData.gameOverCount === 1 && (
        <div className='textAndButton'>
          <h1>Game Over</h1>
          <button onClick={navigateHome}>Play Again</button>
        </div>
      )}
      {gameData.gameOverCount === 2 && (
        <div className="animated-background">
          <h1>YOU WIN</h1>
          <button onClick={navigateHome}>Play Again</button>
        </div>
      )}
      {gameData.gameOverCount === 0 && gameData.game && (
        <div id='gamePlay'>
          <p>You have {count} turns remaining</p>
          <form>
            <input
              type="text"
              id="guess"
              value={gameData.guess.join("")}
              name="guess"
              onChange={handleGuessChange}
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

          <ul id='prevPlays'>{displayPreviousGuesses()}</ul>
        </div>
      )}
    </>
  );
};

export default Game;