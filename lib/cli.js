const inquirer = require('inquirer');
const fs = require('fs');


class CLI {
    constructor(){
        
        this.questions = ["view all departments","View all roles","View all employee","Add a department",
        "Add a role","Add an employee","Add an employee role","Exit"];
    }
run() {
return inquirer
  .prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'mainprompt',
      choices: this.questions,
    },
  ])
  .then((data) => {
    switch (data.action) {
      case 'Add department':
          //addDepartment();
          break;
      case 'Add employee':
          //addEmployee();
          break;
      case 'Add role':
          //addRole();
          break;
      case 'View by department':
          //viewByDepartment();
          break;
      case 'View roles':
          //viewRoles();
          break;
      case 'View employees':
          //viewEmployees();
          break;
      case 'Update employee roles':
          //updateEmpRoles();
          break;
      default:
          //db.end();
          break;
  }
  });

}
}

module.exports = CLI;

 