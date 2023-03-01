import mongoose from "mongoose";
import joi from "joi";
import express from "express";
export declare const userSchema: mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    username: string;
    password: string;
    email: string;
    permissionLevel: number;
    role: string;
}>;
export declare const User: mongoose.Model<{
    username: string;
    password: string;
    email: string;
    permissionLevel: number;
    role: string;
}, {}, {}, {}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, {
    username: string;
    password: string;
    email: string;
    permissionLevel: number;
    role: string;
}>>;
export declare function validateUser({ body }: express.Request): joi.ValidationResult | undefined;
//# sourceMappingURL=user.d.ts.map