

import express from "express";
import { User, validate } from "../models/user";

const router = express.Router();

router.post("/", (request, response) => {
    response.status(400).send("Bad Data");
});

export default router;