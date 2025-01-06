// Import required modules
const confDAO = require("../models/confModel");
const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Initialize Models
const conf = new confDAO({ filename: "conf.db", autoload: true });
const users = new UserModel("users.db");

// Register User
exports.registerUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if the username already exists
  users.getUserByUsername(username)
    .then((existingUser) => {
      if (existingUser) {
        // If username exists, send an error message
        return res.status(409).json({ message: "Username already exists" });
      }
      // If username does not exist, proceed with password hashing
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({ message: "Error hashing password" });
        }

        // Add  new user to the database
        users.addUser({ username, password: hash })
          .then(() => {
            console.log("User registered successfully:", username);
            res.status(201).json({ message: "User registered successfully" });
          })
          .catch((dbErr) => {
            console.error("Error adding user to the database:", dbErr);
            res.status(500).json({ message: "Registration failed" });
          });
      });
    })
    // catch error if the username check fails
    .catch((err) => {
      console.error("Error checking for existing user:", err);
      res.status(500).json({ message: "Registration failed" });
    });
};

// Login User
exports.loginUser = (req, res) => {
  const { username, password } = req.body; 

  // Log the login attempt with details 
  console.log("Login attempt:", {
    username,
    passwordProvided: Boolean(password), 
  });

  users
    .getUserByUsername(username) // Fetch user by username from the database
    .then((user) => {
      console.log("User found in DB:", user); // Log the user data if found
      if (!user) {
        console.warn("No user found with username:", username); // Warning for missing user
        return res.status(404).json({ message: "User not found" }); // Respond with 404 if user not found
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        console.log("Password compare result:", { err, isMatch }); // Log the result of password comparison
        if (err) {
          console.error("Bcrypt comparison error:", err); // Log any error
          return res.status(500).json({ message: "Login failed" }); // Respond with 500 on error
        }
        if (!isMatch) {
          console.warn("Invalid credentials for user:", username); // Log invalid credentials warning
          return res.status(400).json({ message: "Invalid credentials" }); // Respond with 400 on invalid credentials
        }

        const token = jwt.sign({ id: user._id }, "your_secret_key", {
          expiresIn: "1h", // Token expiration time
        });
        console.log("Login successful:", { username: user.username, token }); // Log successful login

        // Respond with token, username, and user ID
        res
          .status(200)
          .json({ token, username: user.username, userId: user._id });
      });
    })
    .catch((err) => {
      console.error("Error during getUserByUsername:", err); // Log any errors during database query
      res.status(500).json({ message: "Login failed" }); // Respond with 500 on database error
    });
};

// Get all talks
exports.listConf = (req, res) => {
  conf
    .getAllEntries() // Fetch all talks
    .then((list) => res.json(list)) // Send the list as a JSON response
    .catch((err) => {
      console.error("Error fetching talks:", err); // Log error
      res.status(500).send("Internal server error"); // Respond with 500 on error
    });
};

// Get talks by speaker
exports.listOneSpeaker = (req, res) => {
  conf
    .getSpeaker(req.params.term) // Fetch talks by speaker
    .then((list) => res.json(list)) // Send the list as a JSON response
    .catch((err) => {
      console.error("Error fetching speaker:", err); // Log error
      res.status(500).send("Internal server error"); // Respond with 500 on error
    });
};

// Get talks by session
exports.listSession = (req, res) => {
  conf
    .getSession(req.params.term) // Fetch talks by session using the term
    .then((list) => res.json(list)) // Send the list as a JSON response
    .catch((err) => {
      console.error("Error fetching session:", err); // Log error
      res.status(500).send("Internal server error"); // Respond with 500 on error
    });
};

// Get talks by time
exports.listTime = (req, res) => {
  conf
    .getTime(req.params.term) // Fetch talks by time
    .then((list) => res.json(list)) // Send the list as a JSON response
    .catch((err) => {
      console.error("Error fetching time:", err); // Log error
      res.status(500).send("Internal server error"); // Respond with 500 on error
    });
};

// Get ratings by talk ID
exports.listRatingsById = (req, res) => {
  conf
    .getTalkById(req.params.id) // Fetch talk by ID
    .then((talk) => {
      if (!talk || !talk[0]) {
        return res.json([]); // Return empty array if no talk found
      }
      const ratingObjects = talk[0].ratings || []; // Retrieve ratings array
      const numericRatings = ratingObjects.map((r) => r.rating); // Extract numeric ratings
      res.json(numericRatings); // Send numeric ratings as JSON
    })
    .catch((err) => {
      console.error("Error fetching ratings:", err); // Log error
      res.status(500).send("Internal server error"); // Respond with 500 on error
    });
};

// Get ratings by speaker
exports.listRatingsBySpeaker = (req, res) => {
  conf
    .getSpeaker(req.params.speaker) // Fetch talks by speaker
    .then((list) => {
      if (!list || !list[0]) {
        return res.json([]); // Return empty array if no talks found
      }
      const ratingObjects = list[0].ratings || []; // Retrieve ratings array
      const numericRatings = ratingObjects.map((r) => r.rating); // Extract numeric ratings
      res.json(numericRatings); // Send numeric ratings as JSON
    })
    .catch((err) => {
      console.error("Error fetching speaker ratings:", err); // Log error
      res.status(500).send("Internal server error"); // Respond with 500 on error
    });
};

// GET rating by talk ID
exports.rateTalkById = (req, res) => {
  const { id, rating } = req.params; // Extract talk ID and rating

  if (!id || !rating || rating < 1 || rating > 5) {
    return res.status(400).send("Invalid rating data"); // Validate rating data
  }

  conf
    .getTalkById(id) // Fetch talk by ID
    .then((talk) => {
      if (!talk || talk.length === 0) {
        return res.status(404).send("Talk not found"); // Respond if no talk found
      }
      const ratingNumber = parseInt(rating, 10); // Convert rating to integer
      talk[0].ratings = talk[0].ratings || []; // Ensure ratings array exists
      talk[0].ratings.push({ rating: ratingNumber, userId: null }); // Add new rating

      conf.conf.update(
        { id }, // Update the talk with the new rating
        { $set: { ratings: talk[0].ratings } },
        {},
        (err) => {
          if (err) {
            console.error("Failed to update ratings", err); // Log update error
            res.status(500).send("Failed to update ratings"); // Respond with 500 on error
          } else {
            console.log(`Rating ${ratingNumber} added for talk ${id}`); // Log success
            res.status(201).send("Rating added successfully"); // Respond with success
          }
        }
      );
    })
    .catch((err) => {
      console.error("Error finding talk:", err); // Log error
      res.status(500).send("Error finding talk"); // Respond with 500 on error
    });
};

// Post rating with { talkId, rating, userId } in the body
exports.handlePosts = (req, res) => {
  let { talkId, rating, userId } = req.body; // Extract data from the request body

  userId = userId || null; // Default userId to null if not provided
  rating = parseInt(rating, 10); // Convert rating to an integer

  conf
    .getTalkById(talkId) // Fetch talk by ID
    .then((talk) => {
      if (!talk || talk.length === 0) {
        return res.status(404).send("Talk not found"); // Respond if no talk found
      }

      talk[0].ratings = talk[0].ratings || []; // Ensure ratings array exists

      // Check if the user has already rated this talk
      const existingIndex = talk[0].ratings.findIndex(
        (r) => r.userId === userId
      );
      if (existingIndex !== -1) {
        talk[0].ratings[existingIndex].rating = rating; // Update existing rating
      } else {
        talk[0].ratings.push({ rating, userId }); // Add new rating
      }

      // Update the talk in the database
      conf.conf.update(
        { id: talkId },
        { $set: { ratings: talk[0].ratings } },
        {},
        (err) => {
          if (err) {
            console.error("Failed to update ratings", err); // Log error
            res.status(500).send("Failed to update ratings"); // Respond with 500 on error
          } else {
            console.log(
              `Rating ${rating} added/updated for talk ${talkId} by user ${userId}` // Log success
            );
            res.status(201).send("Rating added/updated successfully"); // Respond with success
          }
        }
      );
    })
    .catch((err) => {
      console.error("Error finding talk:", err); // Log error if fetching fails
      res.status(500).send("Error finding talk"); // Respond with 500 on error
    });
};