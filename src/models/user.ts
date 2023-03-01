

import jwt from "jsonwebtoken";
const mongoose = require("mongoose");
import config from "config";
const joi = require("joi");
import express from "express";
import _ from "lodash";

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
    permissionLevel: {
        type: Number,
        min: 1,
        max: 10,
        default: 1,
    },
    role: {
        type: String,
        maxLength: "50",
        default: "",
    }
})

userSchema.methods.generateJWT = function() {
    return jwt.sign(
        _.pick(this, ["username", "role", "email", "_id"]), 
        config.get("jwtPrivateKey")
    );
}

export const User = mongoose.model("user", userSchema);

export function validateUser({ body }: express.Request) : any {
    const schema = joi.object({
        username: joi.string().min(3).max(50).required(),
        password: joi.string().min(8).max(50).required(),
        email: joi.string().email().max(60).required()
    })

    return schema.validate(body);
}