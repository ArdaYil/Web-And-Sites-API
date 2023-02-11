

import user from "../routes/user";
import express from "express";

export default function(app: express.Application) {
    app.use("/api/users", user);
}