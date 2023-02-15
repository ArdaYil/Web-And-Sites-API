

import express from "express";
import { User, validateUser } from "../models/user";
import validate from "../middleware/validate";
import _ from "lodash";
import bcrypt from "bcrypt";

const router = express.Router();

router.post("/", (validate(validateUser)), async (request, response) => {
    const {username, email, password} = request.body;

    const user = await User.findOne({email: email});
    
    if (user) return response.status(400).send("User already registered");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: any = new User({
        username,
        email,
        password: hashedPassword
    });

    await newUser.save();

    const token = newUser.generateJWT();

    response.status(200).header("x-auth-token", token).json(_.pick(newUser, ["_id", "username", "email", "role"]));
});

export default router;