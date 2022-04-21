const mysql = require('mysql');

let dbConnection;

const initDb = () => {
  dbConnection = mysql.createConnection({
    user: process.env.DB_USER,
    host: 'localhost',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  //   dbConnection.connect((err) => {
  //     if (err) throw err;
  //     console.log('Connected to DB!');
  //   });
};

module.exports = { initDb, db: dbConnection };
