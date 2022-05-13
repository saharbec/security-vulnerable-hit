DROP DATABASE IF EXISTS test_db;
CREATE DATABASE test_db;
USE test_db;

CREATE TABLE users(
                      id int AUTO_INCREMENT PRIMARY KEY,
                      firstname VARCHAR(50),
                      lastname VARCHAR(50),
                      email VARCHAR(50) UNIQUE,
                      password VARCHAR(100),
                      failedLoginAttempts int,
                      salt VARCHAR(100)
);

CREATE TABLE notes(
                      id int AUTO_INCREMENT PRIMARY KEY,
                      email VARCHAR(50),
                      title VARCHAR(50),
                      content VARCHAR(1000)
);
