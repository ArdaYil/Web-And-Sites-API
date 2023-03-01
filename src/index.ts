

import express from "express";
import db from "./startup/db.js";
import middleware from "./startup/middleware";
import route from "./startup/route";

const app = express();

// Initialize middleware functions

middleware(app);
db();
route(app);

const port = process.env.PORT || 8000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;