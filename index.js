// TODO: Include packages needed for this application
const inquirer = require("inquirer");
const fs = require("fs");
const generateReadme = require("./utils/generateMarkdown")

//What was your motivation? , Why did you build this project? ,What problem does it solve?, What did you learn?

// TODO: Create an array of questions for user input
const questions = [
    "What's your project title?","What's the description of your project?",
    "What's your project installation?","What's this project usage for?",
    "What's your project license ?","Who are the contributors of this project?",
    "How does your project run or test?","What do I do if I have an issue? ",
    "What's your GitHub username? ","What's your email? "
];

const names=["title","description","installation","usage",
    "license","contributing","tests","questions","username","email"];


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
 
 
  
