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
const supertest_1 = __importDefault(require("supertest"));
const user_1 = require("../../../models/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("config"));
let server;
describe("routes - auth", () => {
    let username;
    let email;
    let password;
    beforeEach(() => {
        username = "John Smith";
        email = "john.smith@example.com";
        password = "12345678";
        server = require("../../../index");
    });
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield server.close();
        yield user_1.User.remove({});
    }));
    const execute = () => {
        return (0, supertest_1.default)(server)
            .post("/api/auth")
            .send({ email, password });
    };
    const insertUser = () => {
        return (0, supertest_1.default)(server)
            .post("/api/users")
            .send({ username, email, password });
    };
    it("should return return 400 if email is greater than 60 characters", () => __awaiter(void 0, void 0, void 0, function* () {
        email = new Array(61).join("a") + "@email.com";
        const result = yield execute();
        expect(result.status).toBe(400);
    }));
    it("should return return 400 if email is an invalid email", () => __awaiter(void 0, void 0, void 0, function* () {
        email = new Array(10).join("a");
        const result = yield execute();
        expect(result.status).toBe(400);
    }));
    it("should return return 400 if password less than 8 characters", () => __awaiter(void 0, void 0, void 0, function* () {
        password = "1234567";
        const result = yield execute();
        expect(result.status).toBe(400);
    }));
    it("should return return 400 as there is no such user", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield execute();
        expect(result.status).toBe(400);
    }));
    it("should return return 400 if email is wrong", () => __awaiter(void 0, void 0, void 0, function* () {
        yield insertUser();
        email = "fiwe@email.com";
        const result = yield execute();
        expect(result.status).toBe(400);
    }));
    it("should return return 400 if password is wrong", () => __awaiter(void 0, void 0, void 0, function* () {
        yield insertUser();
        password = "12345678910";
        const result = yield execute();
        expect(result.status).toBe(400);
    }));
    it("should return return 200", () => __awaiter(void 0, void 0, void 0, function* () {
        yield insertUser();
        const result = yield execute();
        expect(result.status).toBe(200);
    }));
    it("should return return a valid jwt", () => __awaiter(void 0, void 0, void 0, function* () {
        const { body } = yield insertUser();
        const response = yield execute();
        const result = jsonwebtoken_1.default.verify(response.body, config_1.default.get("jwtPrivateKey"));
        console.log(body._id);
        expect(result).toHaveProperty("username", username);
        expect(result).toHaveProperty("email", email);
        expect(result).toHaveProperty("role", "");
        expect(result).toHaveProperty("_id", body._id);
    }));
});
