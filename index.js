const mysql = require('mysql');
const inquirer = require('inquirer');



let roles;
let departments;
let managers;
let employees;
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Whsfb772020",
    database: "employees_db"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
    // getDepartments();
    // getRoles();
    // getManagers();
    // getEmployees();
});

start = () => {
    
    inquirer.prompt({
            name: "choices",
            type: "list",
            message: "What would you like to do?",
            choices: ["Add", "View", "Update", "Delete", "Exit"]
        }).then(function(answer) {
            if (answer.choices === "Add") {
                addSomething();
            }
            else if (answer.choices === "View") {
               viewSomething();
           }
           else if (answer.choices === "Update") {
              updateSomething();
            }
            else if (answer.choices === "Delete") {
                deleteSomething();
            }
            else if (answer.choices == "Exit") {
                connection.end();
            }
           
       });
}
getRoles = () => {
    connection.query("SELECT id, title FROM role", (err, res) => {
        if(err) throw err;
       roles = res;
   });
}
getDepartments = () => {
    connection.query("SELECT id, name FROM department", (err, res) => {
        if (err) throw err;
        departments = res;
    })
}
getManagers = () => {
    connection.query("SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee", (err, res) => {
        if (err) throw err;
        managers = res;
    });
}
getEmployees = () => {
    connection.query("SELECT id, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee", (err, res) => {
        if (err) throw err;
        managers = res;
    });
}
addSomething = () => {
    inquirer.prompt([
        {
            name: "add",
            type: "list",
            message: "What would you like to add?",
            choices: ["Department", "Role", "Employee", "Exit"]
        }
    ]).then(function(answer) {
        if (answer.add === "Department") {
            console.log("Add a new: " + answer.add);
            addDepartment();
        }
        else if (answer.add === "Role") {
            console.log("Add a new: " + answer.add);
            addRole();
        }else if(answer.add === "Employee") {
            console.log("Add a new: " + answer.add);
            addEmployee();
        }
        else if (answer.add === "Exit") {
            console.log("Goodbye");
            connection.end();
        }
    });
}

addDepartment = () => {
    inquirer.prompt([
        {
        name: "department",
        type: "input",
        message: "What department would you like to add?"
        }
    ]).then(function(answer) {
        connection.query(`INSERT INTO department (name) VALUES ('${answer.department}')`, (err, res) => {
            if (err) throw err;
            console.log("1 new department added: " + answer.department);
            getDepartment();
            start();
        })
    })
}

