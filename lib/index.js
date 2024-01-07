// TODO: Include packages needed for this application
const inquirer = require("inquirer");
const fs = require("fs");
//const generateReadme = require("./utils/generateMarkdown")

//What was your motivation? , Why did you build this project? ,What problem does it solve?, What did you learn?

// TODO: Create an array of questions for user input
const questions = [
    "view all departments?","View all roles?","View all employee?","Add a department",
    "Add a role","Add an employee","add an employee role"
];

const names=["department","role","employee","adddepartment","addrole","addemployee","addemployeerole"];


const dataobj={};

//generate question prompt
function questionmsg(){
  let index = 0;

  const askQuestion = () => {
    inquirer.prompt([{type : "input",name: names[index], message: questions[index]}]).then((data) => {
        Object.assign(dataobj,data);
      index++;
     
      if (index < questions.length && index != 4) {
        askQuestion (); 
      }
      else if(index == 4)
      {
        askQuestion2();
      }
      else if(index == questions.length )
      {
        const result = generateReadme.generateMarkdown(dataobj);
        const filename = `./readme-files/README.md`;
            //`./readme-files/${dataobj.title.toLowerCase().split(' ').join('')}.md`;
        writeToFile(filename,result);
        
      }

    });
  
  } 
  const askQuestion2 = () => {
    inquirer.prompt([{type : "list",name: names[index], message: questions[index],
         choices: ["Apache","Academic","GNU","ISC","MIT","Mozilla","Open"]}]).then((data) => {
            Object.assign(dataobj,data);
      index++;
 
      if (index < questions.length) {
        askQuestion (); 
      }

    });
  } 
  askQuestion();

}


// TODO: Create a function to write README file
function writeToFile(fileName, data) {
  fs.writeFile(fileName, data, (err) =>
      err ? console.log(err) : console.log('README file saved on "Readme-files" folder'));
}

// TODO: Create a function to initialize app
function init() {
  
  questionmsg();

}


// Function call to initialize app
init();


/////////////////////////////////////////////////////////////////////////////////////

const inquirer = require('inquirer');
const fs = require('fs');

inquirer
  .prompt([
    {
      type: 'input',
      name: 'name',
      message: 'What is your name?',
    },
    {
      type: 'checkbox',
      message: 'What languages do you know?',
      name: 'stack',
      choices: ['HTML', 'CSS', 'JavaScript', 'MySQL'],
    },
    {
      type: 'list',
      message: 'What is your preferred method of communication?',
      name: 'contact',
      choices: ['email', 'phone', 'telekinesis'],
    },
  ])
  .then((data) => {
    const filename = `${data.name.toLowerCase().split(' ').join('')}.json`;

    fs.writeFile(filename, JSON.stringify(data, null, '\t'), (err) =>
      err ? console.log(err) : console.log('Success!')
    );
  });
 
  
