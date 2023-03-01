"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../models/user");
const validate_1 = __importDefault(require("../middleware/validate"));
const lodash_1 = __importDefault(require("lodash"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
router.post("/", ((0, validate_1.default)(user_1.validateUser)), (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = request.body;
    const user = yield user_1.User.findOne({ email: email });
    if (user)
        return response.status(400).send("User already registered");
    const salt = yield bcrypt_1.default.genSalt(10);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    const newUser = new user_1.User({
        username,
        email,
        password: hashedPassword
    });
    yield newUser.save();
    const token = newUser.generateJWT();
    response.status(200).header("x-auth-token", token).json(lodash_1.default.pick(newUser, ["_id", "username", "email", "role"]));
}));
exports.default = router;
