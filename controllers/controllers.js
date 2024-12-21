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

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.error("Error hashing password:", err);
      return res.status(500).json({ message: "Error hashing password" });
    }

    users
      .addUser({ username, password: hash })
      .then(() => {
        console.log("User registered successfully:", username);
        res.status(201).json({ message: "User registered successfully" });
      })
      .catch((dbErr) => {
        console.error("Registration failed:", dbErr);
        res.status(500).json({ message: "Registration failed" });
      });
  });
};

// Login User
exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  console.log("Login attempt:", { username, passwordProvided: Boolean(password) });

  users.getUserByUsername(username)
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

        const token = jwt.sign({ id: user._id }, "your_secret_key", { expiresIn: "1h" });
        console.log("Login successful:", { username: user.username, token });
        res.status(200).json({ token, username: user.username });
      });
    })
    .catch((err) => {
      console.error("Error during getUserByUsername:", err);
      res.status(500).json({ message: "Login failed" });
    });
};

// -------------------- Talks Endpoints --------------------
// Ensure these match your confDAO methods:
exports.listConf = (req, res) => {
  conf
    .getAllEntries()
    .then((list) => res.json(list))
    .catch((err) => {
      console.error("Error fetching talks:", err);
      res.status(500).send("Internal server error");
    });
};

exports.listOneSpeaker = (req, res) => {
  conf
    .getSpeaker(req.params.term)
    .then((list) => res.json(list))
    .catch((err) => {
      console.error("Error fetching speaker:", err);
      res.status(500).send("Internal server error");
    });
};

exports.listSession = (req, res) => {
  conf
    .getSession(req.params.term)
    .then((list) => res.json(list))
    .catch((err) => {
      console.error("Error fetching session:", err);
      res.status(500).send("Internal server error");
    });
};

exports.listTime = (req, res) => {
  conf
    .getTime(req.params.term)
    .then((list) => res.json(list))
    .catch((err) => {
      console.error("Error fetching time:", err);
      res.status(500).send("Internal server error");
    });
};

exports.listRatingsById = (req, res) => {
  conf
    .getTalkById(req.params.id)
    .then((list) => res.json(list[0]?.ratings || []))
    .catch((err) => {
      console.error("Error fetching ratings:", err);
      res.status(500).send("Internal server error");
    });
};

exports.listRatingsBySpeaker = (req, res) => {
  conf
    .getSpeaker(req.params.speaker)
    .then((list) => res.json(list[0]?.ratings || []))
    .catch((err) => {
      console.error("Error fetching speaker ratings:", err);
      res.status(500).send("Internal server error");
    });
};

exports.rateTalkById = (req, res) => {
  const { id, rating } = req.params;

  if (!id || !rating || rating < 1 || rating > 5) {
    return res.status(400).send("Invalid rating data");
  }

  conf
    .rateTalkById(id, rating)
    .then(() => {
      console.log(`Rating ${rating} added for talk ${id}`);
      res.status(201).send("Rating added successfully");
    })
    .catch((err) => {
      console.error("Failed to update ratings", err);
      res.status(500).send("Failed to update ratings");
    });
};

exports.handlePosts = (req, res) => {
  const { talkId, rating } = req.body;

  if (!talkId || !rating || rating < 1 || rating > 5) {
    return res.status(400).send("Invalid rating data");
  }

  conf
    .getTalkById(talkId)
    .then((talk) => {
      if (!talk || talk.length === 0) {
        return res.status(404).send("Talk not found");
      }

      talk[0].ratings.push(rating);

      conf.conf.update(
        { id: talkId },
        { $set: { ratings: talk[0].ratings } },
        {},
        (err) => {
          if (err) {
            console.error("Failed to update ratings", err);
            res.status(500).send("Failed to update ratings");
          } else {
            console.log(`Rating ${rating} added for talk ${talkId}`);
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
