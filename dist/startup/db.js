"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
function default_1() {
    const db = config_1.default.get("db");
    mongoose_1.default.connect(db)
        .then(() => console.log(`Connected to ${db}...`))
        .catch(() => console.warn(`Could not connect to ${db}`));
}
exports.default = default_1;
