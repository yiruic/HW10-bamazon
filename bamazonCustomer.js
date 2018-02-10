var inquirer = require("inquirer");
// var chalk = require("chalk");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "yirui",
    database: "bamazon"
});

// connecting to "bamazon" database and prompt customer choices.
connection.connect(function(err) {
    if (err) throw err;
    // console.log(chalk.bold.magenta("******* Welcome to BAMAZON *******"));
    customerChoice();
});

var customerChoice = function() {

    // Select all details of products from the database
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res) {
        inquirer.prompt({
            type: "list",
            name: "productList",
            message: "What do you like to buy?",

            // List the product names
            choices: function(data) {
                var productArray = [];
                for (var i = 0; i < res.length; i++) {
                    productArray.push(res[i].product_name);
                }
                return productArray;
            };
     }).then(function(item) {

                // Get the selected product and prompt field to input quatity for customer.
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === item.productList) {
                        var chosenProduct = res[i];
                        inquirer.prompt({
                            type: "input",
                            name: "quantity",
                            message: "Price is: $" + chosenProduct.price + "\nHow many of them would you like to buy?",
                            validate: function(value) {
                                if (isNaN(value) === false && value !== 0 && value.length > 0) {
                                    return true;
                                }
                                return false;
                            }
                        }).then(function(count) {

                            // If customer demand is more than stock item quantity throw message.
                            if (chosenProduct.stock_quantity < parseInt(count.quantity)) {
                                console.log(chalk.red("Sorry, We only have " +
                                    chosenProduct.stock_quantity + " " +
                                    chosenProduct.product_name + "(s)"));
                                customerChoice();
