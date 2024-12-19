const confDAO = require("../models/confModel");
const conf = new confDAO({ filename: "conf.db", autoload: true });

exports.newList = function (req, res) {
  conf.init();
  res.redirect("/");
};
exports.listConf = function (req, res) {
  conf
    .getAllEntries()
    .then((list) => {
      res.json(list);
      console.log(list);
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

exports.listOneSpeaker = function (req, res) {
  let speakerName = req.params["term"];
  conf
    .getSpeaker(speakerName)
    .then((list) => {
      res.json(list);
      console.log(list);
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

exports.listSession = function (req, res) {
  let sessionName = req.params["term"];
  conf
    .getSession(sessionName)
    .then((list) => {
      res.json(list);
      console.log(list);
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

exports.listTime = function (req, res) {
  let talkTime = req.params["term"];
  conf
    .getTime(talkTime)
    .then((list) => {
      res.json(list);
      console.log(list);
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

exports.listRatingsBySpeaker = function (req, res) {
  let speakerName = req.params["speaker"];
  conf
    .getSpeaker(speakerName)
    .then((list) => {
      res.json(list[0].ratings);
      console.log("ratings: ", list[0].ratings);
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

exports.listRatingsById = function (req, res) {
  let talkId = req.params["id"];
  conf
    .getTalkById(talkId)
    .then((list) => {
      res.json(list[0].ratings);
      console.log("ratings: ", list[0].ratings);
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

exports.rateTalkById = function (req, res) {
  let talkId = req.params["id"];
  let newRating = req.params["rating"];

  conf
    .rateTalkById(talkId, newRating)
    .then(console.log("adding rating using params"))
    .catch((err) => {
      console.log("promise rejected", err);
    });
};

exports.handlePosts = function (req, res) {
  const { talkId, rating } = req.body;  // Ignore userId completely

  // Validate rating data
  if (!talkId || !rating || rating < 1 || rating > 5) {
    res.status(400).send("Invalid rating data");
    return;
  }

  // Find the talk by its ID
  conf.getTalkById(talkId)
    .then((talk) => {
      if (!talk || talk.length === 0) {
        res.status(404).send("Talk not found");
        return;
      }

      // Add the rating without any userId
      talk[0].ratings.push(rating);

      // Update the talk's ratings
      conf.conf.update(
        { id: talkId },
        { $set: { ratings: talk[0].ratings } },
        {},
        (err, numReplaced) => {
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
      console.error("Failed to find talk", err);
      res.status(500).send("Failed to find talk");
    });
};


