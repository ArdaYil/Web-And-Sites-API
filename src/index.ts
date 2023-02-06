

import express from "express";

const app = express();

// Initialize middleware functions

const port = process.env.PORT || 8000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = server;