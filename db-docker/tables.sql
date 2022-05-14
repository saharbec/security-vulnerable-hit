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

CREATE TABLE customers(
                      id int AUTO_INCREMENT PRIMARY KEY,
                      inviting_id int,
                      name VARCHAR(50),
                      email VARCHAR(50),
                      FOREIGN KEY (inviting_id) REFERENCES users(id)
);

CREATE TABLE passwords(
                      password VARCHAR(100),
                      user_id int,
                      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                      FOREIGN KEY (user_id) REFERENCES users(id)
);

DELIMITER //

CREATE PROCEDURE getAllCustomers() 
BEGIN
	SELECT *  FROM customers;
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE searchCustomers(IN term VARCHAR(80)) 
BEGIN
	SELECT id, name, email FROM customers WHERE name = term;
END //

DELIMITER ;