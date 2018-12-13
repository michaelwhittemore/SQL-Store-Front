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
    mainPrompt();
});

function mainPrompt() {
    inquirer.prompt({
        message: "Hello Supervisor, what action would you like to perform?",
        type: "list",
        name: "action",
        choices: ["View Product Sales by Department", "Create New Department"]
    }).then(function (answer) {
        if (answer.action == "View Product Sales by Department") {
            displayDepartments()
        } else if (answer.action == "Create New Department") {
            createDepartment()
        }
    })
}
function displayDepartments() {
    console.log(`id |${standardLength("Department Name", 20)}|Overhead  |Sales     |Total Profit`)
    connection.query("SELECT * FROM departments", function (err, table) {
        if (err) throw err;

        for (i in table) {

            let department_id = standardLength(table[i].department_id, 3)
            let department_name = standardLength(table[i].department_name, 20)
            let over_head_costs = standardLength(table[i].over_head_costs, 10)
            let product_sales = standardLength(table[i].product_sales, 10)
            let total_profit = Number(table[i].product_sales) - Number(table[i].over_head_costs)
            console.log(`${department_id}|${department_name}|${over_head_costs}|${product_sales}|${total_profit}`)
        }
        connection.end()
    })
}
function createDepartment() {
    inquirer.prompt([
        {
            message: "What is the name of the department that you wish to add?",
            type:"input",
            name:"department_name"
        },
        {
            message:"What is the overhead cost of this department?",
            type:"input",
            name:"over_head_costs"
        }
    ]).then(function(answer){
        connection.query("INSERT INTO departments SET ?",{
            department_name:answer.department_name,
            over_head_costs:answer.over_head_costs
        },function(err,result){
            console.log(`${answer.department_name} insert into departments`)
            connection.end()
        })
    })
}
function standardLength(myString, min) {
    if (typeof (myString) != "string") {
        myString = myString.toString()
    }
    while (myString.length < min) {
        myString += " "
    }
    return myString
}