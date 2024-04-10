import axios from "axios";
import { GAMES_API, NUMBERS_API } from "../constants";
const BASE_URL = "http://localhost:5001";

class MastermindApi{

    static async getGame(gameId){
        const res = await axios.get(`${GAMES_API}${gameId}`);
        console.log('api',res.data)
        return res.data;
    }

    static async getRandomNumbers(difficultyLevel){
      const res = await axios.get(NUMBERS_API, { params: {
        'num': difficultyLevel,
        'min': 0,
        'max': 7,
        'col': 1,
        'base': 10,
        'format': 'plain',
        'rnd': 'new'
      } });
 
      return res.data;
    }

    static async createGame(game){
        const res = await axios.post(GAMES_API, game);
        return res.data;
    }

    static async deleteGames(){
        const res = await axios.delete(GAMES_API);
        return res;
    }

    static async createGuess(gameId, guess){
        const res = await this.api.post(`${GAMES_API}/${gameId}/guesses`, { guess });
        return res.data;
    }
}

export default MastermindApi;