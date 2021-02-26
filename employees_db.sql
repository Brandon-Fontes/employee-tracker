DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;
USE employees_db;
CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(50) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT,
    PRIMARY KEY (id)
);
CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    roles_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id)
);
INSERT INTO department (name)
VALUES ("Sales"),
    ("Engineering"),
    ("Human Resources"),
    ("Legal"),
    ("Finance"),
    ("Artist");
INSERT INTO roles (title, salary, department_id)
VALUES ("CEO", "100000", "7"),
    ("Software Developer", "70000", "2"),
    ("Lawyer", "60000", "3"),
    ("Lawyer", "60000", "4"),
    ("Actuary", "60000", "5"),
    ("Artist", "70000", "6"),
    ("Salesman", "40000", "1");
INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES ("Elon", "Musk", "4", "2"),
    ("Mark", "Rober", "3", "4"),
    ("Michael", "Reeves", "4", "7"),
    ("Jhonathan", "Ma", "3", "9");
SELECT e.id,
    e.first_name,
    e.last_name,
    d.name AS department,
    r.title,
    r.salary,
    CONCAT_WS(" ", m.first_name, m.last_name) AS manager
FROM employee e
    LEFT JOIN employee m ON m.id = e.manager_id
    INNER JOIN roles r ON e.roles_id = r.id
    INNER JOIN department d ON r.department_id = d.id
ORDER BY e.id ASC;
Select r.id,
    r.title,
    r.salary,
    d.name AS Department_Name
FROM roles AS r
    INNER JOIN department AS d ON r.department_id = d.id;
Select id,
    CONCAT_WS(' ', first_name, last_name) AS Employee_Name
FROM employee;
UPDATE employee
SET roles_id = 3
WHERE id = 8;
DELETE FROM department
WHERE id = 13;