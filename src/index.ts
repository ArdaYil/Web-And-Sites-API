

import express from "express";
import db from "./startup/db";
import middleware from "./startup/middleware";

const app = express();

// Initialize middleware functions

middleware(app);
db();

const port = process.env.PORT || 8000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;