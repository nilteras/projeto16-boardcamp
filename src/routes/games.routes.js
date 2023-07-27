import { Router } from "express";
import { createGames, findGames } from './../controllers/games.controller.js'


const gamesRouter = Router();

gamesRouter.get('/games', findGames); 
gamesRouter.post('/games', createGames); 

export default gamesRouter;