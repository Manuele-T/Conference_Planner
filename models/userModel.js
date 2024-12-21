const nedb = require("gray-nedb");

class UserModel {
  constructor(filePath) {
    this.db = new nedb({ filename: filePath, autoload: true });
  }

  // Add a user to the database
  addUser(user) {
    return new Promise((resolve, reject) => {
      this.db.insert(user, (err, newUser) => {
        if (err) reject(err);
        else resolve(newUser);
      });
    });
  }

  // Get a user by their username
  getUserByUsername(username) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ username }, (err, user) => {
        if (err) reject(err);
        else resolve(user);
      });
    });
  }
}

module.exports = UserModel;
