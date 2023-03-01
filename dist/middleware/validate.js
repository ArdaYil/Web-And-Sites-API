"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function validate(validateFunc) {
    return (request, response, next) => {
        const { error } = validateFunc(request);
        const returnValue = (error) ? error.details[0].message : null;
        if (returnValue)
            return response.status(400).send(returnValue);
        next();
    };
}
exports.default = validate;
