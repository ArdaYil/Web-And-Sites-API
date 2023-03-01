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
// Users should be able to send post requests to /api/users
// The body should contain following data: username, email, password, newsletter
// The server should validate the body that is sent
// The server should set admin level to 0 and roles to ""
// The server should make sure an account with the same email is not in the database
// The server should hash the password
// The server should create the user document and store in in the database
// The server should create a jwt and sent it back with an http header back to the client
// The server should send back the user object to the client
// The server should send a 200 status message
let server;
describe("routes - users", () => {
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
            .post("/api/users")
            .send({ username, email, password });
    };
    const userValidation = (user) => {
        expect(user).toHaveProperty("username", "John Smith");
        expect(user).toHaveProperty("email", "john.smith@example.com");
        expect(user).toHaveProperty("role", "");
    };
    it("should return 400 if username is less than 3 characters", () => __awaiter(void 0, void 0, void 0, function* () {
        username = "aa";
        const result = yield execute();
        expect(result.status).toBe(400);
    }));
    it("should return 400 if username is more than 51 characters", () => __awaiter(void 0, void 0, void 0, function* () {
        username = new Array(52).join("a");
        const result = yield execute();
        expect(result.status).toBe(400);
    }));
    it("should return 400 if password is less than 8 characters", () => __awaiter(void 0, void 0, void 0, function* () {
        password = "1234567";
        const result = yield execute();
        expect(result.status).toBe(400);
    }));
    it("should return 400 if password is more than 51 characters", () => __awaiter(void 0, void 0, void 0, function* () {
        password = new Array(52).join("a");
        const result = yield execute();
        expect(result.status).toBe(400);
    }));
    it("should return 400 if email is more than 60 characters", () => __awaiter(void 0, void 0, void 0, function* () {
        email = new Array(61).join("a") + "@gmail.com";
        const result = yield execute();
        expect(result.status).toBe(400);
    }));
    it("should return 400 if email is invalid", () => __awaiter(void 0, void 0, void 0, function* () {
        email = "aaaa";
        const result = yield execute();
        expect(result.status).toBe(400);
    }));
    it("should return 400 if account already exists", () => __awaiter(void 0, void 0, void 0, function* () {
        const newUser = new user_1.User({
            username: "12345",
            password: "123456789",
            email: "john.smith@example.com"
        });
        yield newUser.save();
        const result = yield execute();
        expect(result.status).toBe(400);
    }));
    it("should return 200, the user object, and set role and permissionLevel if data is valid and user does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield execute();
        expect(response.status).toBe(200);
        userValidation(response.body);
    }));
    it("should return a valid jwt in the header", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield execute();
        const token = response.get("x-auth-token");
        const valid = jsonwebtoken_1.default.verify(token, config_1.default.get("jwtPrivateKey"));
        expect(valid).toBeTruthy();
    }));
    it("should store the user in the databse", () => __awaiter(void 0, void 0, void 0, function* () {
        yield execute();
        const user = yield user_1.User.findOne({ email });
        userValidation(user);
        expect(user.password).toBeTruthy();
        expect(user.permissionLevel).toBe(1);
    }));
});
