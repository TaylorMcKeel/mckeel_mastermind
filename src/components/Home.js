import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NUMBERS_API, GAMES_API } from "../constants";
import MastermindApi from "../hooks/api";

const Home = () => {
  const navigate = useNavigate();
  const [difficultyLevel, setDifficultyLevel] = useState(4)

//since only one game runs at a time, when this component mounts all games are deleted.
  useEffect(() => {
    const deleteGames = async () => {
      console.log(MastermindApi)
      try {
        MastermindApi.deleteGames()
          .then
          ((res) => console.log(`${res} was deleted from the database`));
      } catch (err) {
        console.log(err)
      }
    };

    deleteGames();
  }, []);
  

  //this function gets 4 random numbers from the api, and sends the new game to the database.
  const startNewGame = async () => {
    let randomNumbers
    localStorage.clear()
    try {
      const generatedNumbers = await MastermindApi.getRandomNumbers(difficultyLevel)
      randomNumbers = generatedNumbers.split("\n")
      randomNumbers.pop()
      
      const createdGame = await MastermindApi.createGame({
        numbers: randomNumbers,
        plays: 0,
        prevPlays: [],
        difficulty: difficultyLevel
      });
      localStorage.setItem('gameId', createdGame._id)
    } catch (err) {
      console.log(err)
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
    } catch (err) {
      console.log(err)
    }
    navigate("/gameplay");
  };

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
      <button onClick={onLetsBeginClicked}>Let's Begin</button>
    </div>
  );
};

export default Home;