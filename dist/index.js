"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./startup/db"));
const middleware_1 = __importDefault(require("./startup/middleware"));
const route_1 = __importDefault(require("./startup/route"));
const app = (0, express_1.default)();
// Initialize middleware functions
(0, middleware_1.default)(app);
(0, db_1.default)();
(0, route_1.default)(app);
const port = process.env.PORT || 8000;
const server = app.listen(port, () => console.log(`Listening on port ${port}...`));
exports.default = server;
