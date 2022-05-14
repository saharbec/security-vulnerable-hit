const jwt = require('jsonwebtoken');
const router = require('express').Router();

const DB = require('../database');
const verifyToken = require('../middlewares/auth');

router.post('/addCustomer', verifyToken, async (req, res) => {
  jwt.verify(
    req.headers['x-access-token'],
    process.env.TOKEN_KEY,
    (error, authData) => {
      if (error) {
        res.status(401).send('An authentication error occurred');
      } else {
        try {
          const { email, name } = req.body;
          DB.getDbInstance().query(
            `INSERT INTO customers (inviting_id, name, email) VALUES ('${authData.user.id}','${name}','${email}')`, // !SQL Injection
            (err, result) => {
              if (err) {
                console.log(err);
                res.status(400).send('An error occurred');
              } else {
                res.status(200).send('Customer added successfully');
              }
            }
          );
        } catch {
          res.status(400).send('An error occurred');
        }
      }
    }
  );
});

module.exports = router;
