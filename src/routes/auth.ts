

import express, {Request, Response} from "express";
import joi from "joi";
import bcrypt from "bcrypt";
import {User} from "../models/user.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post("/", [validate(validateAuthBody)], async (request : Request, response : Response) => {
    const {email, password} = request.body;
    const user: any = await User.findOne({email});

    if (!user) return response.status(400).send("User does not exist");
    const result = await bcrypt.compare(password, user.password);
    if (!result) return response.status(400).send("Wrong password");

    const jwt = user.generateJWT();

    response.json(jwt);
});

function validateAuthBody({ body }: Request): any {
    const schema = joi.object({
        password: joi.string().min(8).max(50).required(),
        email: joi.string().email().max(60).required()
    })

    return schema.validate(body);
}

export default router;