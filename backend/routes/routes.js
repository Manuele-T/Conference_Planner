const express = require("express");
const passport = require("passport");
const router = express.Router();
const controller = require("../controllers/controllers");

// Routes
router.get("/talks", controller.listConf);
router.get('/talks/speaker/:term', controller.listOneSpeaker);
router.get('/talks/session/:term', controller.listSession);
router.get('/talks/time/:term', controller.listTime);
router.get('/talks/:speaker/rating', controller.listRatingsBySpeaker);
router.get('/talks/:id/ratingById', controller.listRatingsById);
router.get('/talks/rate/:id/:rating', controller.rateTalkById);
router.post('/posts', controller.handlePosts);
router.post("/register", controller.registerUser);
router.post("/login", controller.loginUser);

/*
Protected Route Example - not implemented
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ message: `Welcome, ${req.user.username}` });
  }
);
*/

// router.get("/setup", controller.newList);

// Handle 404 Errors
router.use((req, res) => {
  res.status(404);
  res.type("text/plain");
  res.send("404 Not found.");
});

// Handle Server Errors
router.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500);
  res.type("text/plain");
  res.send("Internal Server Error.");
});

module.exports = router;