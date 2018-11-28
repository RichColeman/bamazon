const inquirer = require("inquirer");
const mysql = require("mysql");
const table = require("table").table;
const connection = mysql.createConnection({
    password: "Redkorn@1",
    user: "root",
    host: "127.0.0.1",
    port: 3306,
    database: "bamazon"

}); // please don't memorize my password! :)
connection.connect(err => {
    if (err) throw err;
});

let productsDisplayed = false;

const displayProducts = () => {
    // connect to database
    connection.query("SELECT * FROM bamazon.products", (err, res) => {
        if (err) {
            throw err;
        }
        const data = res.map(product => [product.item_id, product.product_name, product.price]);
        console.log("\nWelcome to BAMazon! We have a very diverse yet specific choice of items you can buy! See our catalogue below!");
        console.log(table(data));
        productsDisplayed = true;
        getUserResponse();
    });

}
const getUserResponse = () => {
    if (productsDisplayed) {
        inquirer.prompt([{
                name: "choice",
                type: "list",
                choices: ["Red Dead Redemption 2", "Black Hoodie", "NBA2K19", "White Beanie", "Samsung 4k UHD LED TV", "Google Pixel 3", "Akira Blu Ray", "Rex Goliath Merlot", "Jimmy Butler 76ers Jersey", "Cheesesteak"],
                message: "What would you like to buy? Use your arrows to choose and Enter to select",
            },
            {
                name: "quantity",
                type: "input",
                message: "How many?"
            }
        ]).then(answers => {

            // connect to database and update quantity
            let productChosen = answers.choice;
            let quantityChosen = answers.quantity;
            connection.query("SELECT * FROM bamazon.products WHERE ?", {
                product_name: productChosen
            }, (err, res) => {
                if (err) {
                    throw err;
                }
                let cost = parseFloat(res[0].price * quantityChosen);
                if (quantityChosen > res[0].stock_quantity) {
                    console.log("\nOh no! We don't have enough of that item in stock to meet your demand!\n\n Curse you, capitalism!\n");
                    connection.end();
                } else {
                inquirer.prompt([{
                    name: "confirm",
                    type: "confirm",
                    message: "Your cost is $" + cost + " Do you wish to proceed?"


                }]).then(finalAnswer => {
                    let quantityLeft = res[0].stock_quantity -= quantityChosen;
                    if (finalAnswer) {
                        console.log("OK GREAT! Bamazon now has " + quantityLeft + " of those left!");
                        connection.query("UPDATE bamazon.products SET ? WHERE ?", [{
                                stock_quantity: quantityLeft
                            },
                            {
                                product_name: productChosen
                            }
                        ]), (err, res) => {
                            if (err) {
                                throw err;
                            }
                        }
                    }
                })

            }})
        })
    }
};


displayProducts();