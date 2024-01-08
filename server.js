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




//const deletedRow = 3;
//db.query(`DELETE FROM favorite_books WHERE id = ?`, deletedRow, (err, result) => {
  //if (err) {
    //console.log(err);
 // }
  //console.log(result);
//});

//// Query database
//db.query('SELECT * FROM favorite_books', function (err, results) {
  //console.log(results);
//});


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
       //addRole();
       viewDeptname();
        break;
    case questions[5]:

        break;
    case questions[6]:

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


function viewDeptname(){
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
          const query = 'INSERT INTO role (name) VALUES (?)';
          db.query(query, data.name, (err, res) => {
              if (err) throw err;
              askquestion();
          })
      })
  });
  //return list
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


