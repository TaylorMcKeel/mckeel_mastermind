import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MastermindApi from "../hooks/api";

const DIFFICULTY_DEFAULT_VALUE = 4;

const GameDifficulty = Object.freeze({
  EASY: 4,
  MEDIUM: 5,
  HARD: 6
})


const Home = () => {
  const navigate = useNavigate();
  const [difficultyLevel, setDifficultyLevel] = useState(DIFFICULTY_DEFAULT_VALUE)


  //this function gets 4 random numbers from the api, and sends the new game to the database.
  const startNewGame = async () => {
    localStorage.clear()
    try { 
      const createdGame = await MastermindApi.createGame({
        numbers: [],
        plays: 0,
        prevPlays: [],
        difficulty: difficultyLevel,
        gameState: 0
      });
      localStorage.setItem('gameId', createdGame._id)
      console.log('New game was created :: startNewGame, Home.js');
    } catch (err) {
      console.error('New game was not created :: startNewGame, Home.js');
    }
    
  };

  //changes difficulty lvel based on user input
  const handleDifficultyChange =(ev)=>{
    setDifficultyLevel(Number(ev.target.value))
  }

//this funtion allows us to wait until a new game is created to navigate to the next component
  const onLetsBeginClicked = async () => {
    try {
      await startNewGame();
      console.log('Successsfully created new game :: onLetsBeginClicked, Home.js');
    } catch (err) {
      console.error(`Failed to create new game :: onLetsBeginClicked, Home.js - Error: ${err}`);
    }
    navigate("/gameplay");
  };
  const continueOldGame = ()=>{
    navigate("/gameplay");
  }
  //if there is a game in local storage, we will give the user the option to continue the game
  if(localStorage.getItem('gameId')){
    return (
      <div className='textAndButton'>
        <h1 >Mastermind</h1>
        <div id='difficulty'>
          <label htmlFor='difficulty'>Choose a Difficulty:</label>
          <select name='difficulty'  onChange={handleDifficultyChange}>
            <option value='4'>Easy: 4 Numbers</option>
            <option value='5'>Medium: 5 Numbers</option>
            <option value='6'>Hard: 6 Numbers</option>
          </select>
        </div>
        <button onClick={onLetsBeginClicked}>Start New Game</button>
        <button onClick={continueOldGame}>Continue Old Game</button>
      </div>
    );
  }else{
    return (
      <div className='textAndButton'>
        <h1 >Mastermind</h1>
        <div id='difficulty'>
          <label htmlFor='difficulty'>Choose a Difficulty:</label>
          <select name='difficulty'  onChange={handleDifficultyChange}>
            <option value={GameDifficulty.EASY}>Easy: 4 Numbers</option>
            <option value={GameDifficulty.MEDIUM}>Medium: 5 Numbers</option>
            <option value={GameDifficulty.HARD}>Hard: 6 Numbers</option>
          </select>
        </div>
        <button onClick={onLetsBeginClicked}>Start New Game</button>
      </div>
    );
  }
};

export default Home;