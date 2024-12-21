const nedb = require("gray-nedb");

class Conf {
  constructor(confFilePath) {
    console.log(confFilePath);
    this.conf = confFilePath ? new nedb(confFilePath) : new nedb();
  }

  // Initialize the database with talks
  init() {
    const initialTalks = [
      {
        id: "1",
        speaker: "Martin Fowler",
        title: "Patterns of Enterprise Application Architecture",
        description:
          "The practice of enterprise application development has benefited from the emergence of many new enabling technologies...",
        session: "A",
        time: "9:00",
        tags: ["patterns", "architecture"],
        ratings: [],
      },
      {
        id: "2",
        speaker: "David Flanagan",
        title: "JavaScript: The Definitive Guide",
        description:
          "This talk is both an example-driven programmer's guide and a keep-on-your-desk reference...",
        session: "A",
        time: "10:30",
        tags: ["javascript", "es6"],
        ratings: [],
      },
      // Add the remaining initial talks here...
    ];

    initialTalks.forEach((talk) => this.conf.insert(talk));
  }

  getAllEntries() {
    return new Promise((resolve, reject) => {
      this.conf.find({}, (err, entries) => {
        if (err) reject(err);
        else resolve(entries);
      });
    });
  }

  getSpeaker(speakerName) {
    return new Promise((resolve, reject) => {
      this.conf.find({ speaker: speakerName }, (err, entries) => {
        if (err) reject(err);
        else resolve(entries);
      });
    });
  }

  getSession(sessionName) {
    return new Promise((resolve, reject) => {
      this.conf.find({ session: sessionName }, (err, entries) => {
        if (err) reject(err);
        else resolve(entries);
      });
    });
  }

  getTime(talkTime) {
    return new Promise((resolve, reject) => {
      this.conf.find({ time: talkTime }, (err, entries) => {
        if (err) reject(err);
        else resolve(entries);
      });
    });
  }

  getTalkById(id) {
    return new Promise((resolve, reject) => {
      this.conf.find({ id }, (err, entries) => {
        if (err) reject(err);
        else resolve(entries);
      });
    });
  }

  rateTalkById(id, newRating) {
    const rating = Number(newRating);
    return new Promise((resolve, reject) => {
      this.conf.update({ id }, { $push: { ratings: rating } }, {}, (err, numUpdated) => {
        if (err) reject(err);
        else resolve(numUpdated);
      });
    });
  }

  rateTalk(talkId, newRating) {
    const id = String(talkId);
    const rating = Number(newRating);
    return new Promise((resolve, reject) => {
      this.conf.update({ id }, { $push: { ratings: rating } }, {}, (err, numUpdated) => {
        if (err) reject(err);
        else resolve(numUpdated);
      });
    });
  }
}

module.exports = Conf;
