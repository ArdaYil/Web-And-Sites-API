

import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import config from "config";

export const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minLength: 5,
        maxLength: 20,
        trim: true,
        required: true
    },
    password: {
        type: String,
        minLength: 5,
        maxLength: 1000,
        trim: true,
        required: true
    },
    email: {
        type: String,
        minLength: 5,
        maxLength: 1000,
        email: true,
        trim: true,
        required: true
    },
})

userSchema.methods.generateJWT = function() {
    return jwt.sign(this, config.get("jwtPrivateKey"));
}

export const User = mongoose.model("user", userSchema);