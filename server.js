const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const CLI = require('./lib/cli.js');

const cli = new CLI();

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
  cli.run();
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



// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});



