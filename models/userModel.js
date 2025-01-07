 // Import NeDB library
const nedb = require("gray-nedb");
class UserModel {
  constructor(filePath) {
    this.db = new nedb({ filename: filePath, autoload: true }); // Initialize the database with the given file path
  }

  // Add a user to the database
  addUser(user) {
    return new Promise((resolve, reject) => {
      this.db.insert(user, (err, newUser) => {
        if (err) reject(err); // Reject the promise on error
        else resolve(newUser); // Resolve with the newly added user
      });
    });
  }

  // Get a user by their username
  getUserByField(query) {
    return new Promise((resolve, reject) => {
      this.db.findOne(query, (err, user) => {
        if (err) reject(err); // Reject the promise on error
        else resolve(user); // Resolve with the found user or null if not found
      });
    });
  }
}
module.exports = UserModel; // Exporting the UserModel class
