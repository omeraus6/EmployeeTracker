const inquirer = require('inquirer');

const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');

const { table } = require('table');


const questions = ["view all departments","View all roles","View all employee","Add a department",  
      "Add a role","Add an employee","Update an employee role","Exit"];

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

//prompt start
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
              console.log("New Department added to database");
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
                console.log("New role added to database");
                askquestion();
            })
         })
          
      })
  });
}


function addEmployee() {
  let first=[];
  let last=[];
  let employees = [];
  let roles = [];
  const query = 'SELECT * FROM employee';
  db.query(query, (err, res) => {
       if (err) throw err;
       employees[0] = "None"
       for(let i=0; i<res.length;i++)
       {
           employees[i+1] = res[i].first_name + " " + res[i].last_name;
           first[i] = res[i].first_name;
           last[i] = res[i].last_name;
       }
      db.query('SELECT * FROM role', (err, result) => {
          if (err) throw err;
          for(let i=0; i<result.length;i++)
            roles[i] = result[i].title;

            inquirer
              .prompt([
               {
                  type: 'input', 
                  name: 'first',
                  message: 'What id the employee first name?'
               },
               {
                  type: 'input',
                  name: 'last',
                  message: 'What is the employee last name?'
               },
               {
                  type: 'list',
                  name: 'role',
                  message: 'What is the employee role?',
                  choices: roles
               },
               {
                  type: 'list',
                  name: 'employee',
                  message: 'who is the employee manager?',
                  choices: employees
               }
              ]).then((data) => {
                for(let i=0;i<res.length;i++)
                {
                  if(data.employee == employees[i] && employees[i] != 'None')
                  {
                    console.log("not none " + data.employee + " " + employees[i]);
                    const query = 'SELECT id FROM employee WHERE first_name = ? AND last_name = ?';
                    db.query(query, [first[i],last[i]], (err, result2) => {
                       if (err) throw err;
                          for(let i=0;i<result.length;i++)
                          {
                            if(data.role == roles[i])
                            {
                              const query = 'SELECT id FROM role WHERE title = ?';
                              db.query(query, data.role, (err, result4) => {
                                if (err) throw err;
                                  const query2 = 'INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)';
                                  db.query(query2, [data.first,data.last,result4[0].id,result2[0].id], (err, result5) => {
                                    if (err) throw err;
                                      console.log("New employee added to database");
                                      i= res.length +2; 
                                      askquestion();
                                  })
                                })
                            }
                          }
                     })
                  }
                  else if(data.employee == employees[i] && employees[i] == 'None')
                  {
                    console.log("none " + data.employee + " " + employees[i]);
                    const query = 'SELECT id FROM role WHERE title = ?';
                        db.query(query, data.role, (err, result4) => {
                            if (err) throw err;
                               const query2 = 'INSERT INTO employee (first_name,last_name,role_id) VALUES (?,?,?)';
                             db.query(query2, [data.first,data.last,result4[0].id], (err, result5) => {
                                if (err) throw err;
                                 console.log("New employee added to database");
                                   i= res.length +2;   
                                  askquestion();
                                  
                              })
                         })
                  }
                }
            });
      });
  });       
                  
  
}


function updateEmpRoles() {
  let first=[];
  let last=[];
  let employees = [];
  let roles = [];
  const query = 'SELECT * FROM employee';
  db.query(query, (err, res) => {
       if (err) throw err;
       for(let i=0; i<res.length;i++)
       {
           employees[i] = res[i].first_name + " " + res[i].last_name;
           first[i] = res[i].first_name;
           last[i] = res[i].last_name;
       }
      db.query('SELECT * FROM role', (err, result) => {
          if (err) throw err;
          for(let i=0; i<result.length;i++)
            roles[i] = result[i].title;

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
              ]).then((data) => {
                for(let i=0;i<res.length;i++)
                {
                  if(data.employee == employees[i])
                  {
                    const query = 'SELECT id FROM employee WHERE first_name = ? AND last_name = ?';
                    db.query(query, [first[i],last[i]], (err, result2) => {
                       if (err) throw err;
                          for(let i=0;i<result.length;i++)
                          {
                            if(data.role == roles[i])
                            {
                              const query = 'SELECT id FROM role WHERE title = ?';
                              db.query(query, data.role, (err, result4) => {
                                if (err) throw err;
                                  const query2 = 'UPDATE employee SET role_id = ? WHERE id = ?';
                                  db.query(query2, [result4[0].id,result2[0].id], (err, result5) => {
                                    if (err) throw err;
                                      console.log("Employee role Updated in database");
                                      askquestion();
                                  })
                                })
                            }
                          }
                     })
                  }
                }
            });
      });
  });
                
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


