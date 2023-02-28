

import user from "../routes/user";
import auth from "../routes/auth";
import express from "express";

export default function(app: express.Application) {
    app.use("/api/users", user);
    app.use("/api/auth", auth);
}