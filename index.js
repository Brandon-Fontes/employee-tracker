const mysql = require('mysql');
const inquirer = require('inquirer');
const {printTable} = require('console-table-printer');




let department;
let manager;
let employee;




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
getRole = () => {
    connection.query("SELECT id, title FROM roles", (err, res) => {
        if(err) throw err;
       role = res;
   });
}
getDepartment = () => {
    connection.query("SELECT id, name FROM department", (err, res) => {
        if (err) throw err;
        department = res;
    });
}
getManagers = () => {
    connection.query("SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS manager FROM employee", (err, res) => {
        if (err) throw err;
        manager = res;
    });
}
getEmployees = () => {
    connection.query("SELECT id, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee", (err, res) => {
        if (err) throw err;
        manager = res;
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
        } else if(answer.add === "Employee") {
            console.log("Add a new: " + answer.add);
            const newLocal = addEmployee();
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
    connection.query("SELECT * FROM department", (err, res) => {
        if(err) throw err;
       dep = res;
   
    let departmentOptions = [];
    for (i = 0; i < dep.length; i++) {
        departmentOptions.push(Object(dep[i]));
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
            choices: dep
        },
    ]).then(function(answer) {
        let departmentOptions = [];
        for (i = 0; i < departmentOptions.length; i++) {
            if (departmentOptions.name === answer.department_id) {
                department_id = departmentOptions.id
            }
        }
        connection.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', ${departmentOptions.id})`, (err, res) => {
            if (err) throw err;

            console.log("1 new role added: " + answer.title);
            getRole();
            start();
        });
    });
});
}

addEmployee = () => {
    getRole();
    getManagers();
    let roleOptions = [];
    for (i = 0; i < roleOptions.length; i++) {
        roleOptions.push(Object(role[i]));
    };
    let managerOptions = [];
    for (i = 0; i < managerOptions.length; i++) {
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
    connection.query("SELECT r.id, r.title, r.salary, d.name AS Department_Name FROM roles AS r INNER JOIN department AS d ON r.department_id = d.id",  (err, res) => {
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
    connection.query("SELECT id, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee", (err, res) => {
        if (err) throw err;
        manager = res;
    
    let employeeOptions = [];

    for (var i = 0; i < manager.length; i++) {
        employeeOptions.push(Object(manager[i]));
    }
    inquirer.prompt([
        {
            name: "updateRole",
            type: "list",
            message: "Which employee's role would you like to update?",
            choices: manager
        }
    ]).then(answer => {
        connection.query("SELECT title FROM employees_db.roles;", (err, res) => {
            if (err) throw err;
            rolling = res;
        let roleOptions = [];
        for (var i = 0; i < roleOptions.length; i++) {
            roleOptions.push(Object(role[i]));
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
            getRole();
            start();
        });
    });
});
});
}

updateEmployeeManager = () => {
    let employeeOptions = [];

    for (var i = 0; i < employeeOptions.length; i++) {
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
                    connection.query(`UPDATE employee SET manager_id = ${newChoice} WHERE id = ${employeeSelected}`), (err, res) => {
                        if (err) throw err;
                    }
                    console.log("Manager update success");
                }
            }
            getEmployees();
            getManagers();
            start();
        });
    });
}
deleteSomething = () => {
    inquirer.prompt([
        {
            name: "delete",
            type: "list",
            message: "What would you like to delete?",
            choices: ["Delete department", "Delete role", "Delete employee", "Exit"]
        }
    ]).then(answer => {
        if (answer.delete === "Delete department") {
            deleteDepartment();
        } else if (answer.delete === "Delete role") {
            deleteRole();
        } else if (answer.delete === "Delete employee") {
            deleteEmployee();
        } else if (answer.delete === "Exit") {
            connection.end();
        }
    });
}

deleteDepartment = () => {
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        dep = res;
    let departmentOptions = [];
    for (i = 0; i < dep.length; i++) {
       departmentOptions.push(Object(dep[i]));
    }
    
    
    
    inquirer.prompt([
        {
            name: "deleteDepartment",
            type: "list",
            message: "What department would you like to delete?",
            choices: dep
        }
    ]).then((answer => {
        connection.query("SELECT title FROM employees_db.roles;", (err, res) => {
        for (i = 0; i < departmentOptions.length; i++) {
            if (answer.deleteDepartment === departmentOptions[i].name) {
                newChoice = departmentOptions[i].id;

                
                connection.query(`DELETE FROM department WHERE id =  ${newChoice} `), (err, res) => {
                    if (err) throw err;
                }
                console.log("Department: " + answer.deleteDepartment + " Deleted");
            }
        }
        getDepartment();
        start();
    });
}));
});



deleteRole = () => {
    connection.query("SELECT title FROM employees_db.roles;", (err, res) => {
        if (err) throw err;
        rolling = res;
    let roleOptions = [];
    for (i = 0; i < rolling.length; i++) {
       roleOptions.push(Object(rolling[i]));
    }
    inquirer.prompt([
        {
            name: "deleteRole",
            type: "list",
            message: "What role would you like to delete?",
            choices: rolling
        }
    ]).then((answer => {
        for (i = 0; i < roleOptions.length; i++) {
            if (answer.deleteRole === roleOptions[i].title) {
                newChoice = roleOptions[i].id;
                connection.query(`DELETE FROM roles WHERE id = ${newChoice}`), (err, res) => {
                    if (err) throw err;
                }
                console.log("Role: " + answer.deleteRole + " Deleted");
            }
        }
        getRole();
        start();
        }));
    });
}};