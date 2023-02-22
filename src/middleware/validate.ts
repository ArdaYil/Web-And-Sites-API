

import express from "express";

export default function validate(validateFunc: Function) {
    return (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const {error} = validateFunc(request);
        const returnValue = (error) ? error.details[0].message : null;
    
        if (returnValue) return response.status(400).send(returnValue);

        next();
    }
}