const menuDAO = require("../models/menuModel");
const menu = new menuDAO({ filename: "menu.db", autoload: true });
const orderDAO = require("../models/ordersModel");
const order = new orderDAO({ filename: "orders.db", autoload: true });
const utils = require("../lib/utils");
const db = require("../config/users");

exports.newList = function (req, res) {
  menu.init();
  res.redirect("/");
};
exports.listMenu = function (req, res) {
  menu
    .getAllEntries()
    .then((list) => {
      res.json(list);
      console.log(list);
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};
exports.listOrders = function (req, res) {
  order
    .getAllEntries()
    .then((list) => {
      res.json(list);
      //console.log(list);
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};
exports.addOrder = function (req, res) {
  console.log("req body to add to database : ", req.body);
  order.addEntry(req.body).catch((err) => {
    console.log("promise rejected", err);
  });
  res.redirect("/");
};

exports.processLogin = function (req, res, next) {
  db.findOne({ username: req.body.username }, { _id: 1 }, function (err, user) {
    if (!user) {
      res.status(401).json({ success: false, msg: "could not find user" });
    }
    console.log(user);
    // Function defined at bottom of app.js
    if (user) {
      const isValid = utils.validPassword(
        req.body.password,
        user.hash,
        user.salt
      );
      if (isValid) {
        const tokenObject = utils.issueJWT(user);
        res.status(200).json({
          success: true,
          token: tokenObject.token,
          expiresIn: tokenObject.expires,
          username: user.username,
        });
      } else {
        res
          .status(401)
          .json({ success: false, msg: "you entered the wrong password" });
      }
    }
  });
};

exports.processNewUser = function (req, res, next) {
  const saltHash = utils.genPassword(req.body.password);

  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = {
    username: req.body.username,
    hash: hash,
    salt: salt,
  };

  console.log(newUser);

  db.insert(newUser, function (err, user) {
    res.json({ success: true, user: user });
  });
};

exports.displayAppData = function (req, res, next) {
  order
    .getAllEntries()
    .then((list) => {
      let listOrders="";
      list.forEach(currentOrders);
      
      function currentOrders(item, index) {
        let foodOrder = item.order.slice(2, item.order.length).toString();
        console.log(foodOrder)
        let nextOrder= index+1 +": Table number: "+ item.order[1]+ " Food ordered: " + foodOrder + "<br \>";
        console.log(nextOrder)
        listOrders= listOrders+ nextOrder
      }
      console.log(listOrders);
      
      res
        .status(200)
        .json({
          success: true,
          msg: listOrders,
        });

      //console.log(list);
    })
    .catch((err) => {
      console.log("promise rejected", err);
    });
};
