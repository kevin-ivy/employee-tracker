DROP DATABASE IF EXISTS employee_roster_db;
CREATE DATABASE employee_roster_db;
USE employee_roster_db;

CREATE TABLE departments (
    id INTEGER AUTO_INCREMENT NOT NULL,
    dept_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INTEGER AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    dept_id INTEGER,
    salary DECIMAL NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (dept_id) REFERENCES departments(id)
);


CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);