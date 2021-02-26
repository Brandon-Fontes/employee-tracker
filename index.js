const mysql = require('mysql');
const inquirer = require('inquirer');
const { start } = require('repl');


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
        });
    });
}

addRole = () => {
    let departmentOptions = [];
    for (i = 0; i < departments.length; i++) {
        departmentOptions.push(Object(departments[i]));
    }

    inquirer.prompt([
        {
            name: "title",
            type: "input",
            message: "What role would you like to add?"
        },
        {
            name: "salary",
            type: "input",
            message: "What is the salary for this position?"
        },
        {
            name: "department_id",
            type: "list",
            message: "What is the department for this position?",
            choices: departmentOptions
        },
    ]).then(function(answer) {
        for (i = 0; i < departmentOptions.length; i++) {
            if (departmentOptions[i].name === answer.department_id) {
                department_id = departmentOptions[i].id
            }
        }
        connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', ${department_id})`, (err, res) => {
            if (err) throw err;

            console.log("1 new role added: " + answer.title);
            getRoles();
            start();
        });
    });
}

addEmployee = () => {
    getRoles();
    getManagers();
    let roleOptions = [];
    for (i = 0; i < roles.length; i++) {
        roleOptions.push(Object(roles[i]));
    };
    let managerOptions = [];
    for (i = 0; i < managers.length; i++) {
        managerOptions.push(Object(managers[i]));
    }
    inquirer.prompt([
        {
            name: "first_name",
            type: "input",
            message: "What is the employee's first name?"
        },
        {
            name: "role_id",
            type: "input",
            message: "What is the employee's last name?"
        },
        {
            name: "role_id",
            type: "input",
            message: "What is the role for this employee?",
            choices: function() {
                var choiceArray = [];
                for (var i = 0; i < roleOptions.length; i++){
                    choiceArray.push(roleOptions[i].title);
                }
                return choiceArray;
            }
        },
        {
            name: "manager_id",
            type: "list",
            message: "Who is the employee's manager?",
            choices: function() {
                var choiceArray = [];
                for (var i = 0; i < managerOptions.length; i++) {
                    choiceArray.push(managerOptions[i].managers);
                }
                return choiceArray;
            }
        }
    ]).then(function(answer) {
        for (i = 0; i < roleOptions.length; i++) {
            if (roleOptions[i].title === answer.role_id) {
                role_id = roleOptions[i].id
            }
        }
        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id)VALUES ('${answer.first_name}', '${answer.last_name}', '${role_id}', ${manager_id})`, (err, res) => {
            if (err) throw err;

            console.log("1 new Employee added: " + answer.first_name + " " + answer.last_name);
            getEmployees();
            start();
         }); 
        });
}

viewSomething = () => {
    inquirer.prompt([
        {
            name: "viewChoice",
            type: "list",
            message: "What do you want to view?",
            choices: ["Departments", "Roles", "Employees", "Exit"]
        }
    ]).then(answer => {
        if (answer.viewChoice === "Departments") {
            viewDepartments();
        } else if (answer.viewChoice === "Roles") {
            viewRoles();
        } else if (answer.viewChoice === "Employees") {
            viewEmployees();
        } else if (answer.viewChoice === "Exit") {
            connection.end();
        }
    })
}

viewDepartments = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        printTable(res);
        start();
    });
};

viewRoles = () => {
    connection.query("SELECT r.id, r.title, r.salary, d.name as Department_Name FROM role AS r INNER JOIN department AS d ON r.department_id = d.id",  (err, res) => {
        if (err) throw err;
        printTable(res);
        start();
    });
};

viewEmployees = () => {
    connection.query('SELECT e.id, e.first_name, e.last_name, d.name AS department, r.title, r.salary, CONCAT_WS(" ", m.first_name, m.last_name) AS manager FROM employee e LEFT JOIN employee m ON m.id = e.manager_id INNER JOIN role r ON e.role_id = r.id INNER JOIN department d ON r.department_id = d.id ORDER BY e.id ASC', (err, res) => {
        if (err) throw err;
        printTable(res);
        start();
    });
};

updateSomething = () => {
    inquirer.prompt([
        {
            name: "update",
            type: "list",
            message: "What would you like to update?",
            choices: ["Update employee roles", "Update employee managers", "Exit"]
        }
    ]).then(answer => {
        if (answer.update === "Update employee roles") {
            updateEmployeeRole();
        } else if (answer.update === "Update employee managers") {
            updateEmployeeManager();
        } else if (answer.update === "Exit") {
            connection.end();
        }
    });
}

updateEmployeeRole = () => {
    let employeeOptions = [];

    for (var i = 0; i < employees.length; i++) {
        employeeOptions.push(Object(employees[i]));
    }
    inquirer.prompt([
        {
            name: "updateRole",
            type: "list",
            message: "Which employee's role would you like to update?",
            choices: function(){
                var choiceArray = [];
                for (var i = 0; i < employeeOptions.length; i++) {
                    choiceArray.push(employeeOptions[i].Employee_Name);
                }
                return choiceArray;
            }
        }
    ]).then(answer => {
        let roleOptions = [];
        for (var i = 0; i < roles.length; i++) {
            roleOptions.push(Object(roles[i]));
        }
        for (var i = 0; i < employeeOptions.length; i++) {
            if (employeeOptions[i].Employee_Name === answer.updateRole) {
                employeeSelected = employeeOptions[i].id
            }
        }
        inquirer.prompt([
            {
                name: "newRole",
                type: "list",
                message: "Please Select a new role:",
                choices: function() {
                    var choiceArray = [];
                    for (var i = 0; i < roleOptions.length; i++) {
                        choiceArray.push(roleOptions[i].title);
                    }
                    return choiceArray;
                }
            }
        ]).then (answer => {
            for (i = 0; i < roleOptions.length; i++) {
                if (answer.newRole === roleOptions[i].title) {
                    newChoice = roleOptions[i].id;
                    connection.query(`UPDATE employee SET role_id = ${newChoice} WHERE id = ${employeeSelected}`), (err, res) => {
                        if (err) throw err;
                    }
                }
            }
            console.log("Role updated success");
            getEmployees();
            getRoles();
            start();
        });
    });
}

updateEmployeeManager = () => {
    let employeeOptions = [];

    for (var i = 0; i < employees.length; i++) {
        employeeOptions.push(Object(employees[i]));
    }
    inquirer.prompt([
        {
            name: "updateManager",
            type: "list",
            message: "Which employee's manager would you like to update?",
            choices: function(){
                var choiceArray = [];
                for (var i = 0; i < employeeOptions.length; i++){
                    choiceArray.push(employeeOptions[i].Employee_Name);
                }
                return choiceArray;
            }
        }
    ]).then(answer => {
        getEmployees();
        getManagers();
        let managerOptions = [];
        for (var i = 0; i < managers.length; i++){
            ManagerOptions.push(Object(managers[i]));
        }
        for (var i = 0; i < employeeOptions.length; i++){
            if (employeeOptions[i].Employee_Name === answer.updateManager) {
                employeeSelected = employeeOptions[i].id;
            }
        }
        inquirer.prompt([
            {
                name: "newManager",
                type: "list",
                message: "Choose a new manager:",
                choices: function(){
                    var choiceArray = [];
                    for (var i = 0; i < managerOptions.length; i++){
                        choiceArray.push(managerOptions[i].managers);
                    }
                    return choiceArray;
                }
            }
        ]).then(answer => {

            for (var i = 0; i < managerOptions.length; i++){
                if (answer.newManager === managerOptions[i].managers) {
                    newChoice = managerOptions[i].id;
                }
            }
    })
}