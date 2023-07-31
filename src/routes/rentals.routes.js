import { Router } from "express";
import { deleteReantals, findRentals, finishRentals, insertRentals } from "../controllers/rentals.controller.js";
import validateSchema from "../middlewares/validateSchema.js";
import { rentalSchema } from "../schemas/rentals.schema.js";

const rentalsRouter = Router();

rentalsRouter.get('/rentals', findRentals);
rentalsRouter.post('/rentals', validateSchema(rentalSchema), insertRentals);
rentalsRouter.post('/rentals/:id/return', finishRentals);
rentalsRouter.delete('/rentals/:id', deleteReantals);

export default rentalsRouter;