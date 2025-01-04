// controllers.js

const confDAO = require("../models/confModel");
const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Initialize Models
const conf = new confDAO({ filename: "conf.db", autoload: true });
const users = new UserModel("users.db");

// -------------------- User Authentication --------------------

// Register User
exports.registerUser = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // First, check if the username already exists
  users.getUserByUsername(username)
    .then((existingUser) => {
      if (existingUser) {
        // If the username exists, send a conflict error
        return res.status(409).json({ message: "Username already exists" });
      }

      // If username does not exist, proceed with password hashing
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error("Error hashing password:", err);
          return res.status(500).json({ message: "Error hashing password" });
        }

        // Add the new user to the database
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
    .catch((err) => {
      console.error("Error checking for existing user:", err);
      res.status(500).json({ message: "Registration failed" });
    });
};

// Login User
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  console.log("Login attempt:", {
    username,
    passwordProvided: Boolean(password),
  });

  users
    .getUserByUsername(username)
    .then((user) => {
      console.log("User found in DB:", user);
      if (!user) {
        console.warn("No user found with username:", username);
        return res.status(404).json({ message: "User not found" });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        console.log("Password compare result:", { err, isMatch });
        if (err) {
          console.error("Bcrypt comparison error:", err);
          return res.status(500).json({ message: "Login failed" });
        }
        if (!isMatch) {
          console.warn("Invalid credentials for user:", username);
          return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, "your_secret_key", {
          expiresIn: "1h",
        });
        console.log("Login successful:", { username: user.username, token });

        // Return userId so the frontend can store it
        res
          .status(200)
          .json({ token, username: user.username, userId: user._id });
      });
    })
    .catch((err) => {
      console.error("Error during getUserByUsername:", err);
      res.status(500).json({ message: "Login failed" });
    });
};

// -------------------- Talks Endpoints --------------------

// GET all talks
exports.listConf = (req, res) => {
  conf
    .getAllEntries()
    .then((list) => res.json(list))
    .catch((err) => {
      console.error("Error fetching talks:", err);
      res.status(500).send("Internal server error");
    });
};

// GET talks by speaker
exports.listOneSpeaker = (req, res) => {
  conf
    .getSpeaker(req.params.term)
    .then((list) => res.json(list))
    .catch((err) => {
      console.error("Error fetching speaker:", err);
      res.status(500).send("Internal server error");
    });
};

// GET talks by session
exports.listSession = (req, res) => {
  conf
    .getSession(req.params.term)
    .then((list) => res.json(list))
    .catch((err) => {
      console.error("Error fetching session:", err);
      res.status(500).send("Internal server error");
    });
};

// GET talks by time
exports.listTime = (req, res) => {
  conf
    .getTime(req.params.term)
    .then((list) => res.json(list))
    .catch((err) => {
      console.error("Error fetching time:", err);
      res.status(500).send("Internal server error");
    });
};

// GET ratings by talk ID (returns array of rating numbers)
exports.listRatingsById = (req, res) => {
  conf
    .getTalkById(req.params.id)
    .then((talk) => {
      if (!talk || !talk[0]) {
        return res.json([]);
      }
      // 'ratings' is now an array of { rating, userId } objects
      const ratingObjects = talk[0].ratings || [];
      // Return just the numeric ratings so the front end can do average
      const numericRatings = ratingObjects.map((r) => r.rating);
      res.json(numericRatings);
    })
    .catch((err) => {
      console.error("Error fetching ratings:", err);
      res.status(500).send("Internal server error");
    });
};

// GET ratings by speaker (optional, if needed)
exports.listRatingsBySpeaker = (req, res) => {
  conf
    .getSpeaker(req.params.speaker)
    .then((list) => {
      if (!list || !list[0]) {
        return res.json([]);
      }
      const ratingObjects = list[0].ratings || [];
      const numericRatings = ratingObjects.map((r) => r.rating);
      res.json(numericRatings);
    })
    .catch((err) => {
      console.error("Error fetching speaker ratings:", err);
      res.status(500).send("Internal server error");
    });
};

// GET rating via /talks/rate/:id/:rating (not used often, but in your code)
exports.rateTalkById = (req, res) => {
  const { id, rating } = req.params;

  if (!id || !rating || rating < 1 || rating > 5) {
    return res.status(400).send("Invalid rating data");
  }

  conf
    .getTalkById(id)
    .then((talk) => {
      if (!talk || talk.length === 0) {
        return res.status(404).send("Talk not found");
      }
      // Convert rating to a number
      const ratingNumber = parseInt(rating, 10);
      talk[0].ratings = talk[0].ratings || [];
      // If your existing data might have rating as numbers, now store them as objects
      talk[0].ratings.push({ rating: ratingNumber, userId: null });

      conf.conf.update(
        { id },
        { $set: { ratings: talk[0].ratings } },
        {},
        (err) => {
          if (err) {
            console.error("Failed to update ratings", err);
            res.status(500).send("Failed to update ratings");
          } else {
            console.log(`Rating ${ratingNumber} added for talk ${id}`);
            res.status(201).send("Rating added successfully");
          }
        }
      );
    })
    .catch((err) => {
      console.error("Error finding talk:", err);
      res.status(500).send("Error finding talk");
    });
};

// POST rating with { talkId, rating, userId } in the body
exports.handlePosts = (req, res) => {
  let { talkId, rating, userId } = req.body;

  // Ensure userId defaults to null if not provided
  userId = userId || null;
  rating = parseInt(rating, 10);

  conf
    .getTalkById(talkId)
    .then((talk) => {
      if (!talk || talk.length === 0) {
        return res.status(404).send("Talk not found");
      }

      // Ensure ratings array exists
      talk[0].ratings = talk[0].ratings || [];

      // Check for an existing rating by the same user
      const existingIndex = talk[0].ratings.findIndex(
        (r) => r.userId === userId
      );
      if (existingIndex !== -1) {
        // Update the existing rating
        talk[0].ratings[existingIndex].rating = rating;
      } else {
        // Add a new rating
        talk[0].ratings.push({ rating, userId });
      }

      // Update the database
      conf.conf.update(
        { id: talkId },
        { $set: { ratings: talk[0].ratings } },
        {},
        (err) => {
          if (err) {
            console.error("Failed to update ratings", err);
            res.status(500).send("Failed to update ratings");
          } else {
            console.log(
              `Rating ${rating} added/updated for talk ${talkId} by user ${userId}`
            );
            res.status(201).send("Rating added/updated successfully");
          }
        }
      );
    })
    .catch((err) => {
      console.error("Error finding talk:", err);
      res.status(500).send("Error finding talk");
    });
};