const mysql = require('mysql');

let dbConnection;

class DB {
  static dbInstance;

  static initDB() {
    DB.dbInstance = mysql.createConnection({
      user: process.env.DB_USER,
      host: 'localhost',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  static getDbInstance() {
    return DB.dbInstance;
  }
}

const initDb = () => {
  //   dbConnection.connect((err) => {
  //     if (err) throw err;
  //     console.log('Connected to DB!');
  //   });
};

module.exports = DB;
