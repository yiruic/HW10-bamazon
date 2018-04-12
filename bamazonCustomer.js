var inquirer = require("inquirer");
var mysql = require("mysql");
require("console.table");

// Initializes the connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "yirui",
    database: "bamazon"
});

// Creates the connection with the server
//and loads the product data upon a successful connection
connection.connect(function(err) {
    if (err) throw err;
    loadProducts();
});

// Function to load the products table from the database
// and print results to the console
var loadProducts = function() {
  // Select all data from the database
  var query = "SELECT * FROM products";
  connection.query(query, function(err, res) {
    if (err) throw err;
    // Draw the table in the terminal using the response
    console.table(res);
    // Then prompt the customer for their choice of product
    //pass all the products to promptCustomerForItem
    promptCustomerForItem(res);
  });
};

// Prompt the customer for a product
function promptCustomerForItem(inventory) {
  // Prompts user for what they would like to purchase
    inquirer
    .prompt({
      type: "input",
      name: "choice",
      message: "What do you like to buy? [Quit with Q]",
      //validate input
      validate: function(val) {
        return isNaN(val) || val.toLowerCase() === "q";
      }
    }).then(function(val) {
    // fulfillment: key q is pressed
    // Check if the user wants to quit the program
    var choiceName = val.choice;
    checkIfShouldExit(choiceName);
    var product = checkInventory(choiceName, inventory);

    console.log(product)
    // If there is a product with the name the user chose, prompt the customer for a desired quantity
    if (product) {
      // Pass the chosen product to promptCustomerForQuantity
      promptCustomerForQuantity(product);
    }
    else {
      // Otherwise let them know the item is not in the inventory, re-run loadProducts
      console.log("\nThat item is not in the inventory.");
      loadProducts();
    }
  });
};

// Prompt the customer for a product quantity
function promptCustomerForQuantity(product) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "quantity",
        message: "How many would you like? [Quit with Q]",
        validate: function(val) {
          return val > 0 || val.toLowerCase() === "q";
        }
      }
    ])
    .then(function(val) {
      // Check if the user wants to quit the program
      checkIfShouldExit(val.quantity);
      var quantity = parseInt(val.quantity);

      // If there isn't enough of the chosen product and quantity, let the user know and re-run loadProducts
      if (quantity > product.stock_quantity) {
        console.log("\nInsufficient quantity!");
        loadProducts();
      }
      else {
        // Otherwise run makePurchase, give it the product information and desired quantity to purchase
        makePurchase(product, quantity);
      }
    });
};


// Purchase the desired quanity of the desired item
function makePurchase(product, quantity) {
  connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
    [quantity, product.item_id],
    function(err, res) {
      // Let the user know the purchase was successful, re-run loadProducts
      console.log("\nSuccessfully purchased " + quantity + " " + product.product_name + "'s!");
      loadProducts();
    }
  );
};

// Check to see if the product the user chose exists in the inventory
function checkInventory(choiceName, inventory) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].product_name === choiceName) {
      // If a matching product is found, return the product
      return inventory[i];
    }
  }
  // Otherwise return null
  return null;
};

// Check to see if the user wants to quit the program
function checkIfShouldExit(choice) {
  if (choice.toLowerCase() === "q") {
    // Log a message and exit the current node process
    console.log("Goodbye!");
    process.exit(0);
  }
};
