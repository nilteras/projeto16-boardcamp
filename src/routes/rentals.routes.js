import { Router } from "express";
import { deleteReantals, findRentals, finishRentals, insertRentals } from "../controllers/rentals.controller.js";

const rentalsRouter = Router();

rentalsRouter.get('/rentals', findRentals);
rentalsRouter.post('/rentals', insertRentals);
rentalsRouter.post('/rentals/:id/return', finishRentals);
rentalsRouter.delete('/rentals/:id', deleteReantals);

export default rentalsRouter;