import { Router } from "express";
import { createGames, findGames } from './../controllers/games.controller.js'
import validateSchema from "../middlewares/validateSchema.js";
import { gameSchema } from "../schemas/games.schema.js";


const gamesRouter = Router();

gamesRouter.get('/games', findGames); 
gamesRouter.post('/games', validateSchema(gameSchema), createGames); 

export default gamesRouter;