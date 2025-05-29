// Import required modules
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const UserModel = require("../models/userModel");

// Initialize the const for interacting with the users database
const users = new UserModel("users.db");
console.log({ filename: "users.db", autoload: true });

// Set options for the JWT strategy
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
  secretOrKey: "your_secret_key", // Secret key for verifying the token
};

// Export JWT strategy configuration
module.exports = (passport) => {
  // Configure JWT strategy
  passport.use(
    new JwtStrategy(options, (jwt_payload, done) => {
      users.getUserByField({ _id: jwt_payload.id }) // Use getUserByField to fetch user by ID
        .then((user) => {
          if (user) {
            return done(null, user); // User found
          }
          return done(null, false); // User not found, authentication failed
        })
        .catch((err) => done(err, false));
    })
  );
};
