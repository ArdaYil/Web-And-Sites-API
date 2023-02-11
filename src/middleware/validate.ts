

import express from "express";

export default function validate(validateFunc: Function) {
    return (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const result = validateFunc(request);

        if (result) return response.status(400).send("Bad Data");

        next();
    }
}