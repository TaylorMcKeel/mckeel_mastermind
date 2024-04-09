import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { NUMBERS_API, GAMES_API } from "../constants";

const Home = () => {
  const navigate = useNavigate();
  const [difficultyLevel, setDifficultyLevel] = useState(4)

//since only one game runs at a time, when this component mounts all games are deleted.
  useEffect(() => {
    const deleteGames = async () => {
      try {
        await axios
          .delete(GAMES_API)
          .then((res) => console.log(`${res} was deleted from the database`));
      } catch (err) {
        console.log(err)
      }
    };

    deleteGames();
  }, []);
  

  //this function gets 4 random numbers from the api, and sends the new game to the database.
  const startNewGame = async () => {
    let randomNumbers
    try {
      await axios
        .get(
          NUMBERS_API,
          {
            params: {
              'num': difficultyLevel,
              'min': 0,
              'max': 7,
              'col': 1,
              'base': 10,
              'format': 'plain',
              'rnd': 'new'
            }
          }
        )
        .then((res) => {
          randomNumbers = res.data.split("\n")
          randomNumbers.pop()
        });

      await axios.post(GAMES_API, {
        numbers: randomNumbers,
        plays: 0,
        prevPlays: [],
        difficulty: difficultyLevel
      });

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