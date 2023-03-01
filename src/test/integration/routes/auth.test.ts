

import { IncomingMessage, Server, ServerResponse } from "http";
import request from "supertest";
import { User } from "../../../models/user.js";
import jwt from "jsonwebtoken";
import config from "config";

let server: Server<typeof IncomingMessage, typeof ServerResponse>;

describe("routes - auth", () => {
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
            .post("/api/auth")
            .send({email, password});
    };

    const insertUser = () => {
        return request(server)
            .post("/api/users")
            .send({username, email, password});
    };

    it("should return return 400 if email is greater than 60 characters", async () => {
        email = new Array(61).join("a") + "@email.com";

        const result = await execute();

        expect(result.status).toBe(400);
    });

    it("should return return 400 if email is an invalid email", async () => {
        email = new Array(10).join("a");

        const result = await execute();

        expect(result.status).toBe(400);
    });

    it("should return return 400 if password less than 8 characters", async () => {
        password = "1234567";

        const result = await execute();

        expect(result.status).toBe(400);
    });

    it("should return return 400 as there is no such user", async () => {
        const result = await execute();
        
        expect(result.status).toBe(400);
    });

    it("should return return 400 if email is wrong", async () => {
        await insertUser();
        email = "fiwe@email.com"

        const result = await execute();
        
        expect(result.status).toBe(400);
    });

    it("should return return 400 if password is wrong", async () => {
        await insertUser();
        password = "12345678910"

        const result = await execute();
        
        expect(result.status).toBe(400);
    });

    it("should return return 200", async () => {
        await insertUser();

        const result = await execute();
        
        expect(result.status).toBe(200);
    });

    it("should return return a valid jwt", async () => {
        const {body} = await insertUser();

        const response = await execute();
        const result = jwt.verify(response.body, config.get("jwtPrivateKey"));

        console.log(body._id);

        expect(result).toHaveProperty("username", username);
        expect(result).toHaveProperty("email", email);
        expect(result).toHaveProperty("role", "");
        expect(result).toHaveProperty("_id", body._id);
    });
});