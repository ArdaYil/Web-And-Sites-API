

import express from "express";
import { User, validateUser } from "../models/user";
import validate from "../middleware/validate";

const router = express.Router();

router.post("/", (validate(validateUser)), (request, response) => {
    
});

export default router;