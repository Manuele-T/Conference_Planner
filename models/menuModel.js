const nedb = require("nedb");

class Menu {
  constructor(menuFilePath) {
    console.log(menuFilePath);
    if (menuFilePath) {
      this.menu = new nedb(menuFilePath);
      console.log("menu connected to " + menuFilePath);
      menuFilePath;
    } else {
      this.menu = new nedb();
    }
  }
  init() {
    this.menu.insert({
      id: "1",
      name: "carrot cake",
      description: "home made here",
      price: "2.50",
      category: "cake",
      available: "no",
    });
    this.menu.insert({
      id: "2",
      name: "sandwiches",
      description: "with a variety of fillings",
      price: "2.50",
      category: "snack",
      available: "no",
    });
    this.menu.insert({
      id: "3",
      name: "salad",
      description: "uses seasonal local produce",
      price: "3.50",
      category: "side",
      available: "yes",
    });
    this.menu.insert({
      id: "4",
      name: "hot chocolate",
      description: "with fully fat or skimmed milk",
      price: "2.00",
      category: "drinks",
      available: "yes",
    });
    this.menu.insert({
      id: "5",
      name: "chocolate cake",
      description: "with cream",
      price: "2.50",
      category: "cake",
      available: "yes",
    });
    this.menu.insert({
      id: "6",
      name: "soup",
      description: "ask for soups available today",
      price: "2.00",
      category: "snack",
      available: "yes",
    });
    this.menu.insert({
      id: "7",
      name: "pizza",
      description: "ham and pineapple or four cheese",
      price: "5.00",
      category: "main",
      available: "yes",
    });
    this.menu.insert({
      id: "8",
      name: "baked potato",
      description: "with cheese, coleslaw, beans or tuna",
      price: "4.50",
      category: "main",
      available: "yes",
    });
    this.menu.insert({
      id: "9",
      name: "apple pie",
      description: "with cream or custard",
      price: "3.50",
      category: "pudding",
      available: "yes",
    });
    this.menu.insert({
      id: "10",
      name: "cheesecake",
      description: "with cream",
      price: "3.00",
      category: "pudding",
      available: "yes",
    });
    this.menu.insert({
      id: "11",
      name: "fish and chips",
      description: "locally caught ",
      price: "6.50",
      category: "main",
      available: "yes",
    });
    this.menu.insert({
      id: "12",
      name: "lasagne",
      description: "with chips or garlic bread",
      price: "6.50",
      category: "main",
      available: "yes",
    });
    this.menu.insert({
      id: "13",
      name: "ice cream",
      description: "various flavours",
      price: "2.50",
      category: "pudding",
      available: "yes",
    });
    this.menu.insert({
      id: "14",
      name: "coffee",
      description: "freshly ground",
      price: "1.50",
      category: "drinks",
      available: "yes",
    });
    this.menu.insert({
      id: "15",
      name: "tea",
      description: "a range of varieties",
      price: "1",
      category: "drinks",
      available: "yes",
    });
    this.menu.insert({
      id: "16",
      name: "pasta",
      description: "with a tomato and garlic sauce",
      price: "5.50",
      category: "main",
      available: "yes",
    });
    this.menu.insert({
      id: "17",
      name: "chips",
      description: "with ketchup or mayonnaise",
      price: "3",
      category: "side",
      available: "yes",
    });
    this.menu.insert({
      id: "18",
      name: "sparkling mineral water",
      description: "locally sourced",
      price: "1.5",
      category: "drinks",
      available: "yes",
    });
  }

  getAllEntries() {
    return new Promise((resolve, reject) => {
      this.menu.find({}, function (err, entries) {
        if (err) {
          reject(err);
        } else {
          resolve(entries);
          console.log("function all() returns: ", entries);
        }
      });
    });
  }
}
module.exports = Menu;
