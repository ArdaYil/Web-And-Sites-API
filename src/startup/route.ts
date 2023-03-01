

import user from "../routes/user.js";
import auth from "../routes/auth.js";
import express from "express";

export default function(app: express.Application) {
    app.use("/api/users", user);
    app.use("/api/auth", auth);
}