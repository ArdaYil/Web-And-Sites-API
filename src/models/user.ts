

import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import config from "config";
import joi from "joi";
import express from "express";

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
        maxLength: 60,
        email: true,
        trim: true,
        required: true,
        unique: true
    },
})

userSchema.methods.generateJWT = function() {
    return jwt.sign(this, config.get("jwtPrivateKey"));
}

export const User = mongoose.model("user", userSchema);

export function validateUser({ body }: express.Request): string | null {
    const schema = joi.object({
        username: joi.string().min(3).max(50).required(),
        password: joi.string().min(8).max(50).required(),
        email: joi.string().email().max(60).required()
    })

    const {error} = schema.validate(body);

    return (error) ? error.details[0].message : null;
}