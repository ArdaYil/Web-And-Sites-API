import express from "express";
export default function validate(validateFunc: Function): (request: express.Request, response: express.Response, next: express.NextFunction) => express.Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validate.d.ts.map