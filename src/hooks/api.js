import axios from "axios";
import { GAMES_API_ENDPOINT, NUMBERS_API } from "../constants";


class MastermindApi{

    static async getGame(gameId){
        const res = await axios.get(`${GAMES_API_ENDPOINT}${gameId}`);
        console.log('api',res.data)
        return res.data;
    }


    static async createGame(game){
        const res = await axios.post(GAMES_API_ENDPOINT, game);
        return res.data;
    }

    static async deleteGames(){
        const res = await axios.delete(GAMES_API_ENDPOINT);
        return res;
    }


}

export default MastermindApi;