import { Router } from "express";
import { findCustomers, getCustomersById, insertCustomers, updateCustomers } from "../controllers/customer.controller.js";
import validateSchema from "../middlewares/validateSchema.js";
import { customerSchema } from "../schemas/customer.schema.js";

const customerRouter = Router();

customerRouter.get('/customers', findCustomers);
customerRouter.get('/customers/:id', getCustomersById);
customerRouter.post('/customers', validateSchema(customerSchema), insertCustomers);
customerRouter.put('/customers/:id', validateSchema(customerSchema), updateCustomers);

export default customerRouter;