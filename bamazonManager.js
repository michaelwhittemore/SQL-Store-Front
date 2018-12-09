var mysql = require("mysql");
var inquirer = require("inquirer")
//var customer =require("./bamazonCustomer")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: "password",
    database: "bamazon"
});
//intiate connection and then begin the logical flow
connection.connect(function (err) {
    if (err) throw err;
    mainPrompt()
});


function mainPrompt() {
    inquirer.prompt([
        {
            message: "Hello Manager, what action would you like to take?",
            name: "action",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
        }
    ]).then(function (answer) {
        if (answer.action == "View Products for Sale") {
            displayTable()
        } else if (answer.action == "View Low Inventory") {
            lowInventory()
        } else if (answer.action == "Add to Inventory") {
            addToInventory()
        } else if (answer.action == "Add New Product") {
            newRow()
        }

    })
}
//prompts the user and then adds a new row
function newRow() {
    inquirer.prompt([
        {
            message: "What is the name of the product that you wish to add?",
            type:"input",
            name:"product_name"
        },{
            message: "What is the department of the product that you wish to add?",
            type:"input",
            name:"department_name"
        },{
            message: "What is the price of the product that you wish to add?",
            type:"input",
            name:"price"
        },{
            message: "How much of the product should we add?",
            type:"input",
            name:"stock_quantity"
        }
    ]).then(function(answer){
        connection.query("INSERT INTO products SET ?",{
            product_name:answer.product_name,
            department_name:answer.department_name,
            price:answer.price,
            stock_quantity:answer.stock_quantity
        },function(err,result){
            console.log(`${answer.product_name} added to storefront`)
            connection.end()
      // Call updateProduct AFTER the INSERT completes
        })
    })
}
//prompts the user for the item ID of their selected item and how much they want to add
function addToInventory() {
    inquirer.prompt([{
        message: "What is the ID of the product that you wish to add?",
        name: "id",
        type: "input"
    }, {
        message: "How much would you like to add?",
        name: "quantity",
        type: "input"
    }]).then(function (answer) {
        connection.query("SELECT * FROM products WHERE ?",
            {
                item_id: answer.id
            }, function (err, row) {
                console.log(`${answer.quantity} of ${row[0].product_name} was added. There is now ${Number(row[0].stock_quantity) + Number(answer.quantity)} remaining`)
                connection.query(`UPDATE products SET ? WHERE ?`, [{
                    stock_quantity: Number(row[0].stock_quantity) + Number(answer.quantity)
                }, {
                    item_id: answer.id
                }],function(){connection.end()})
            })

    })
}
//this should display all items which have an inventory of less than five
function lowInventory() {
    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function (err, table) {
        if (err) throw err;
        for (i in table) {
            console.log(`${table[i].stock_quantity} left of ${table[i].product_name}`)
        }
        connection.end()
    })
}
//displays the data as a table by interating over every row
function displayTable() {
    connection.query("SELECT * FROM products", function (err, table) {
        if (err) throw err;
        //Add a header to the table
        console.log(`ID ${standardLength("Product Name", 30)}${standardLength("Department", 12)}Price  Quantity`)
        for (i in table) {
            //standardize the length so everything lines up nicely
            let itemId = standardLength(table[i].item_id, 3)
            let productName = standardLength(table[i].product_name, 30)
            let departmentName = standardLength(table[i].department_name, 12)
            let price = standardLength(table[i].price, 7)
            let stockQuantity = standardLength(table[i].stock_quantity, 7)
            console.log(`${itemId}${productName}${departmentName}${price}${stockQuantity}`)
        }
        connection.end()
    })
}
//adds spaces until the string is a min length
//converts the input to string if it already isn't
function standardLength(myString, min) {

    if (typeof (myString) != "string") {
        myString = myString.toString()
    }
    while (myString.length < min) {
        myString += " "
    }
    return myString
}