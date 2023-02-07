

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

describe("routes - users", () => {
    
});