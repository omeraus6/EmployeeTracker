const inquirer = require('inquirer');

const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

const { table } = require('table');


const questions = ["view all departments","View all roles","View all employee","Add a department",  
      "Add a role","Add an employee","Add an employee role","Exit"];

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: 'done1982',
    database: 'employee_db'
  },
  console.log(`Connected to the employee_db database.`)

);


db.connect((err) => {
  if (err) throw err;
  askquestion();
});


function askquestion() {
  
inquirer
.prompt([
  {
    type: 'list',
    message: 'What would you like to do?',
    name: 'mainprompt',
    choices: questions,
  },
])
.then((data) => {
  
  action = data.mainprompt;
  switch (data.mainprompt) {
    case questions[0]:
       viewDepartment();
        break;
    case questions[1]:
       viewRoles();
        break;
    case questions[2]:
       viewEmployees();
        break;
    case questions[3]:
       addDepartment()
        break;
    case questions[4]:
       addRole();
        break;
    case questions[5]:
        addEmployee();
        break;
    case questions[6]:
        updateEmpRoles();
        break;
    default:
        db.end();
        break;
}
});
}

function viewDepartment() {
  const query = 'SELECT * FROM department';
  db.query(query, (err, res) => {
      if (err) throw err;
      console.log(table(toTableFormat(res)));
      askquestion();
  });
};


function viewRoles() {
  const query = 'SELECT * FROM role';
  db.query(query, (err, res) => {
      if (err) throw err;
      console.log(table(toTableFormat(res)));
      askquestion();
  });
};


function viewEmployees() {
  const query = 'SELECT * FROM employee';
  db.query(query, (err, res) => {
      if (err) throw err;
      console.log(table(toTableFormat(res)));
      askquestion();
  });
};

function addDepartment() {
  inquirer
      .prompt({
          name: 'name',
          type: 'input',
          message: 'What is the name of the departments?'
      }).then((data) => {
          const query = 'INSERT INTO department (name) VALUES (?)';
          db.query(query, data.name, (err, res) => {
              if (err) throw err;
              askquestion();
          })
      })
}


function addRole(){
  let list = [];
  const query = 'SELECT name FROM department';
  db.query(query, (err, res) => {
      if (err) throw err;
      for(let i=0; i<res.length;i++)
         list[i] = res[i].name;
      inquirer
      .prompt([
        {
          type: 'input',
          name: 'title',
          message: 'What is the name of the role?',
        },
        {
          type: 'input',
          name: 'salary',
          message: 'What is the salary of the role?',
        },
        {
          type: 'list',
          name: 'belong',
          message: 'Which department does the role belong to?',
          choices: list,
        }
      ]).then((data) => {
         const query = 'SELECT id FROM department WHERE name = ?';
         db.query(query, data.belong, (err, result) => {
             if (err) throw err;
             console.log();
             const query2 = 'INSERT INTO role (title,salary,department_id) VALUES (?,?,?)';
             db.query(query2, [data.title,data.salary,result[0].id], (err, result2) => {
               if (err) throw err;
                askquestion();
            })
         })
          
      })
  });
}


function addEmployee() {
  db.query('SELECT * FROM employee', (err, empRes) => {
          const employees = empRes.map(employee => {
              return employee.first_name + ' ' + employee.last_name;
          });
          db.query('SELECT * FROM role', (err, roleRes) => {
                  const roles = roleRes.map(role => {
                      return role.title;
                  });

                  inquirer
                      .prompt([{
                          type: 'input', 
                          name: 'first_name',
                          message: 'What id the employee first name?'
                      },
                      {
                          type: 'input',
                          name: 'last_name',
                          message: 'What is the employee last name?'
                      },
                      {
                          type: 'list',
                          name: 'role_id',
                          message: 'What is the employee role?',
                          choices: roles
                      },
                      {
                          type: 'list',
                          name: 'manager_id',
                          message: 'who is the employee manager?',
                          choices: employees
                      }
                      ]).then((res) => {
                          const { first_name, last_name } = res;
                          const manager = empRes.filter(employee => {
                              return employee.first_name + ' ' + employee.last_name === res.manager;
                          })[0];
                          const role_id = roleRes.filter(role => {
                              return role.title === res.role;
                          })[0];
                          const manager_id = manager ? manager.id : null;
                          db.query(
                              'INSERT INTO employee SET ?',
                              { first_name, last_name, role_id, manager_id }, (err, result) => {
                                  if (err) throw err;
                              }
                          )
                          askquestion();
                      });
              }
          )
      }
  )
}


function updateEmpRoles() {
  const query = 'SELECT * FROM employee';
  db.query(query, (err, res) => {
      const employees = res.map(employee => {
          return employee.first_name + ' ' + employee.last_name;
      });
      db.query('SELECT * FROM role', (err, result) => {
          const roles = result.map(role => {
              return role.title;
          });
          inquirer
              .prompt([
                  {
                      type: 'list',
                      name: 'employee',
                      message: 'Which employee\'s role do you want to update?',
                      choices: employees
                  },
                  {
                      type: 'list',
                      name: 'role',
                      message: 'Which role do you want to assign the selected employee?',
                      choices: roles
                  }
              ]).then(answer => {
                  const id = result.filter(employee => {
                      return employee.first_name + ' ' + employee.last_name === answer.employee;
                  })[0]
                  db.query('UPDATE employee SET role_id = ? where id = ?', [role_id, id], (err, result) => {
                          if (err) throw err;
                          askquestion();
                      }
                  )
              })
      })
  })
}

function toTableFormat(arr) {
  const header = Object.keys(arr[0]);
  const rows = arr.map(obj => Object.values(obj));
  return [header, ...rows];
}


// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


