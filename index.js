const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');
let jobRoles = [];
let deptList = [];
let managerList = [];
let employeeList = [];

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    // Your MySQL username
    user: 'root',
    // Your MySQL password
    password: 'Blossom2010!',
    database: 'employee_roster_db'
  });
  
connection.connect(err => {
   if (err) throw err;
   console.log('connected as id ' + connection.threadId + '\n');
   titleScreen();
});

//Create array of active Job Roles
function createRoleArray() {
    const query = `SELECT id, title FROM roles`;
    connection.query(query,(err,results) => {
        //Empty Roles array before creating new one
        if (jobRoles) {
            jobRoles = [];
        }

        if (err) throw err;
        let string = JSON.stringify(results);
        let json = JSON.parse(string);
        for (i = 0; i < json.length; i++) {
            jobRoles.push(json[i]);
        }
        return;
    });
};

//Create array of active departments
function createDeptArray() {
    const query = `SELECT id, dept_name FROM departments`;
    connection.query(query,(err,results) => {
        //Empty departments array before creating new one
        if (deptList) {
            deptList = [];
        }

        if (err) throw err;
        let string = JSON.stringify(results);
        let json = JSON.parse(string);
        for (i = 0; i < json.length; i++) {
            deptList.push(json[i]);
        }
        return;
    });
};

//Create array of active managers
function createManagersArray() {
    const query = `SELECT id, CONCAT (first_name, ' ', last_name) AS manager FROM employee WHERE manager_id is null`
    connection.query(query,(err,results) =>{
        //Empty Manager List before making a new one
        if (managerList) {
            managerList = [];
        }

        if (err) throw err;
        let string = JSON.stringify(results)
        let json = JSON.parse(string);
        for (i = 0; i < json.length; i++) {
            managerList.push(json[i]);
        }
        return;
    })
}

//Create array of active employees
function createEmployeesArray() {
    const query = `SELECT id, CONCAT (first_name, ' ', last_name) AS employee FROM employee`
    connection.query(query,(err,results) =>{
        //Empty Manager List before making a new one
        if (employeeList) {
            employeeList = [];
        }

        if (err) throw err;
        let string = JSON.stringify(results)
        let json = JSON.parse(string);
        for (i = 0; i < json.length; i++) {
            employeeList.push(json[i]);
        }
        return;
    })
}

//Display app name and present main menu options
function titleScreen() {
    console.log(`
    =====================================
    =                                   =
    =         Employee Tracker          =
    =         Manage Your Team          =
    =                                   = 
    =====================================
    `);
    mainMenu();
};

//Reload to main menu after every interaction. Only display title splash once.
function mainMenu() {
    //Fill arrays each time mainMenu is called
    createDeptArray();
    createRoleArray();
    createEmployeesArray() 
    createManagersArray();

    console.log('');
    inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: ['View All Employees', 
        'View All Departments', 
        'View All Job Roles', 
        'Add a Department', 
        'Add a Job Role', 
        'Add an Employee', 
        'Update Employee Job Role',
        'Quit',
        new inquirer.Separator()
    ]
    }).then(answer => {
        console.log(answer);
        switch(answer.choice) {
            case 'View All Employees':
                viewEmployees();
                break;
            case 'View All Departments':
                viewDepartments();
                break;
            case 'View All Job Roles':
                viewRoles();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Job Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update Employee Job Role':
                updateEmployeeRole();
                break;
            case 'Quit':
                console.log('Goodbye');
                process.exit();
        }
    });
};

//Pull up all employees in a formatted table
function viewEmployees(){
    const query = `SELECT employee.id, first_name, last_name, title, salary, dept_name, manager_id FROM employee JOIN roles ON employee.role_id = roles.id JOIN departments ON roles.dept_id = departments.id ORDER BY employee.id ASC;`;

    connection.query(query, (err,results) => {
        console.log('');
        console.table(results);
        if (err) throw err;
        mainMenu();
    });
};

//Pull up a list of active departments
function viewDepartments() {
    const query = `SELECT * FROM departments AS Departments`

    connection.query(query, (err, results) => {
        console.log('');
        console.table(results);
        if (err) throw err;
        mainMenu();
    });
};

//Pull up a formatted list of active job roles
function viewRoles() {
    const query = `SELECT title, dept_name FROM roles LEFT JOIN departments ON roles.dept_id = departments.id ORDER BY departments.id ASC`

    connection.query(query,(err,results) => {
        console.log('');
        console.table(results);
        if (err) throw err;
        mainMenu();
    });
};

//Add a department to the active departments list
function addDepartment() {
    inquirer.prompt({
            type: 'input',
            name: 'name',
            message: 'Enter new department name:'
        }).then(answer => {
            connection.query(`INSERT INTO departments SET ?`, {dept_name: answer.name}, (err,res) => {
                if (err) throw err;
                console.log('Department added successfully.\n');
                mainMenu();
            });
        });
};

//Add a new Job Role to the active role list
function addRole() {
    let departments = [];

    for (i = 0; i < deptList.length; i++) {
        departments.push(deptList[i].dept_name);
    }

    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: 'Enter job role title:'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Enter salary for job role:'
        },
        {
            type: 'list',
            name: 'dept',
            message: 'Select department for job role:',
            choices: departments
        }
    ]).then(answer => {

        for (i = 0; i < deptList.length; i++) {
            if (answer.dept === deptList[i].dept_name) {
                answer.deptID = deptList[i].id;
            }
        }

        connection.query(`INSERT INTO roles SET ?`, {
            title: answer.title, 
            salary: answer.salary, 
            dept_id: answer.deptID}, (err, res) => {
            if (err) throw err;
            console.log('Job Role added successfully.\n');
            mainMenu();
        });
    });
};

//Add new employee
function addEmployee() {
    let managers = [];

    for (i = 0; i < managerList.length; i++) {
        managers.push(managerList[i].manager);
    }

    managers.push('N/A');
    managers.push(new inquirer.Separator());

    let roles = [];
    for (i = 0; i < jobRoles.length; i++) {
        roles.push(jobRoles[i].title);
    }

    roles.push(new inquirer.Separator());

    inquirer.prompt([
        {
            type: 'input',
            name: 'first',
            message: "Enter employee's first name:"
        },
        {
            type: 'input',
            name: 'last',
            message: "Enter employee's last name:"
        },
        {
            type: 'list',
            name: 'role',
            message: 'Select employee job role:',
            choices: roles
        },
        {
            type: 'list',
            name: 'manager',
            message: "Select employee's manager:",
            choices: managers
        }
    ]).then(answers => {
        //Cycle through jobRoles array to assign Role_ID
        for (i = 0; i < jobRoles.length; i++) {
            if (answers.role === jobRoles[i].title) {
                answers.roleID = jobRoles[i].id;
            }
        }

        //Cycle through Managers array to assign Employee_ID
        if (answers.manager === 'N/A') {
            answers.managerID = null;
        } else{
            for (i = 0; i < managerList.length; i++) {
                if (answers.manager === managerList[i].manager) {
                    answers.managerID = managerList[i].id;
                }
            }
        }

        connection.query(`INSERT INTO employee SET ?`, {
            first_name: answers.first,
            last_name: answers.last,
            role_id: answers.roleID,
            manager_id: answers.managerID}, (err, res) => {
                if (err) throw err;
                console.log('Employee added successfully.\n');
                mainMenu();
            });
        });
};

//Update employee role
function updateEmployeeRole() {
    let employees = [];

    for (i = 0; i < employeeList.length; i++) {
        employees.push(employeeList[i].employee);
    }

    employees.push(new inquirer.Separator());

    let roles = [];
    for (i = 0; i < jobRoles.length; i++) {
        roles.push(jobRoles[i].title);
    }

    roles.push(new inquirer.Separator());

    inquirer.prompt([
        {
            type: 'list',
            name: 'chosen',
            message: 'Choose an employee to update:',
            choices: employees
        },
        {
            type: 'list',
            name: 'role',
            message: 'Select Job Role',
            choices: roles
        }
    ]).then(answer => {
        for (i = 0; i < employeeList.length; i++) {
            if (answer.chosen === employeeList[i].employee) {
                answer.id = employeeList[i].id;
            }
        }

        for (i = 0; i < jobRoles.length; i++) {
            if (answer.role === jobRoles[i].title) {
                answer.roleID = jobRoles[i].id;
            }
        }

        let query = `UPDATE employee SET role_id = ? WHERE id = ?`
        connection.query(query,[answer.roleID, answer.id],(err,res) => {
            if (err) throw err;
            console.log('Employee role updated successfully.\n');
            mainMenu();
        });
    });
};