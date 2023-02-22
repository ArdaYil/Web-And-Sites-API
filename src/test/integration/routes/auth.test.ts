

import { IncomingMessage, Server, ServerResponse } from "http";
import request from "supertest";
import { User } from "../../../models/user";
import jwt from "jsonwebtoken";
import config from "config";

// Users should be able to send post requests to /api/auth
// The body should contain the jwt for the desired payload
// The server should validate the body that is sent
// The server should retrieve the account with the given email, if the email does not exist the server should return 404
// The server should hash the given password and compare with the hash in the user object. If the password is wrong the server should return 403
// The server should send a 200 status message

let server: Server<typeof IncomingMessage, typeof ServerResponse>;

describe("routes - users", () => {
    let username: string;
    let email: string;
    let password: string;

    beforeEach(() => {
        username = "John Smith";
        email = "john.smith@example.com";
        password = "12345678";

        server = require("../../../index");
    });

    afterEach(async () => {
        await server.close();
        await User.remove({});
    });

    const execute = () => {
        return request(server)
            .post("/api/users")
            .send({username, email, password});
    };

    const userValidation = (user: any) => {
        expect(user).toHaveProperty("username", "John Smith");
        expect(user).toHaveProperty("email", "john.smith@example.com");
        expect(user).toHaveProperty("role", "");
    };

    it("should return 400 if username is less than 3 characters", async () => {
        username = "aa";

        const result = await execute();

        expect(result.status).toBe(400);
    });

    it("should return 400 if username is more than 51 characters", async () => {
        username = new Array(52).join("a");

        const result = await execute();

        expect(result.status).toBe(400);
    });

    it("should return 400 if password is less than 8 characters", async () => {
        password = "1234567";

        const result = await execute();

        expect(result.status).toBe(400);
    });

    it("should return 400 if password is more than 51 characters", async () => {
        password = new Array(52).join("a");

        const result = await execute();

        expect(result.status).toBe(400);
    });

    it("should return 400 if email is more than 60 characters", async () => {
        email = new Array(61).join("a") + "@gmail.com";

        const result = await execute();

        expect(result.status).toBe(400);
    });

    it("should return 400 if email is invalid", async () => {
        email = "aaaa";

        const result = await execute();

        expect(result.status).toBe(400);
    });

    it("should return 400 if account already exists", async () => {
        const newUser = new User({
            username: "12345",
            password: "123456789",
            email: "john.smith@example.com"
        });

        await newUser.save();

        const result = await execute();

        expect(result.status).toBe(400);
    });

    it("should return 200, the user object, and set role and permissionLevel if data is valid and user does not exist", async () => {
        const response = await execute();

        expect(response.status).toBe(200);

        userValidation(response.body);
    });

    it("should return a valid jwt in the header", async () => {
        const response = await execute();
        const token = response.get("x-auth-token");
        const valid = jwt.verify(token, config.get("jwtPrivateKey"));

        expect(valid).toBeTruthy();
    });

    it("should store the user in the databse", async () => {
        await execute();

        const user: any = await User.findOne({email});

        userValidation(user);

        expect(user.password).toBeTruthy();
        expect(user.permissionLevel).toBe(1);
    });
});