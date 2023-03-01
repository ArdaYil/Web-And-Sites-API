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
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_1 = require("../models/user");
const validate_1 = __importDefault(require("../middleware/validate"));
const router = express_1.default.Router();
router.post("/", [(0, validate_1.default)(validateAuthBody)], (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = request.body;
    const user = yield user_1.User.findOne({ email });
    if (!user)
        return response.status(400).send("User does not exist");
    const result = yield bcrypt_1.default.compare(password, user.password);
    if (!result)
        return response.status(400).send("Wrong password");
    const jwt = user.generateJWT();
    response.json(jwt);
}));
function validateAuthBody({ body }) {
    const schema = joi_1.default.object({
        password: joi_1.default.string().min(8).max(50).required(),
        email: joi_1.default.string().email().max(60).required()
    });
    return schema.validate(body);
}
exports.default = router;
