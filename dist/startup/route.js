"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../routes/user"));
const auth_1 = __importDefault(require("../routes/auth"));
function default_1(app) {
    app.use("/api/users", user_1.default);
    app.use("/api/auth", auth_1.default);
}
exports.default = default_1;
