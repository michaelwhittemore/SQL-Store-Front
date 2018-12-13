var mysql = require("mysql");
var inquirer = require("inquirer")
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
    displayTable()
});
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
        promptForSale()
    })
}
function promptForSale() {
    inquirer.prompt([{
        message: "What is the id of the item you wish to purchase?",
        type: "input",
        name: "id"
    }, {
        message: "How many would you like to buy?",
        type: "input",
        name: "quantity"
    }]).then(function (answer) {
        connection.query(`SELECT * FROM products WHERE item_id="${answer.id}"`, function (err, row) {
            row = row[0]
            //check to see if we have enough in stock
            if (answer.quantity > row.stock_quantity) {
                console.log(`Insufficient quantity of ${row.product_name}`)
                connection.end()
            } else {
                let purchasePrice = answer.quantity * row.price
                let amountRemaining = row.stock_quantity - answer.quantity
                console.log(`You bought ${answer.quantity} ${row.product_name}'s for $${purchasePrice}!`)
                buyItem(answer.id, amountRemaining, purchasePrice, row.department_name)
            }
        })
    })
}
//should update the database with a reduced quantity of the item
function buyItem(id, quantity, productSales, department_name) {
    //TEST
    
    connection.query(`UPDATE products SET ?, product_sales = product_sales + ${productSales} WHERE ?; `, [{
        stock_quantity: quantity,
        
    }, {
        item_id: id

    }], function () {
        //update the department table with the new sales amount
        connection.query(`UPDATE departments SET product_sales= product_sales + ${productSales} WHERE ?`, { department_name: department_name },
            function () {
                connection.end()
            })
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

//export the table function and standard length
//module.exports={displayTable:function(){displayTable}}