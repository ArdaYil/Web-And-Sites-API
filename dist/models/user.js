"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUser = exports.User = exports.userSchema = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
const joi_1 = __importDefault(require("joi"));
const lodash_1 = __importDefault(require("lodash"));
exports.userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        minLength: 5,
        maxLength: 20,
        trim: true,
        required: true
    },
    password: {
        type: String,
        minLength: 5,
        maxLength: 1000,
        trim: true,
        required: true
    },
    email: {
        type: String,
        minLength: 5,
        maxLength: 60,
        email: true,
        trim: true,
        required: true,
        unique: true
    },
    permissionLevel: {
        type: Number,
        min: 1,
        max: 10,
        default: 1,
    },
    role: {
        type: String,
        maxLength: "50",
        default: "",
    }
});
exports.userSchema.methods.generateJWT = function () {
    return jsonwebtoken_1.default.sign(lodash_1.default.pick(this, ["username", "role", "email", "_id"]), config_1.default.get("jwtPrivateKey"));
};
exports.User = mongoose_1.default.model("user", exports.userSchema);
function validateUser({ body }) {
    const schema = joi_1.default.object({
        username: joi_1.default.string().min(3).max(50).required(),
        password: joi_1.default.string().min(8).max(50).required(),
        email: joi_1.default.string().email().max(60).required()
    });
    return schema.validate(body);
}
exports.validateUser = validateUser;
