const router = require('express').Router();
const jwt = require('jsonwebtoken');

const DB = require('../database');
const verifyToken = require('../middlewares/auth');

router.get('/customers', verifyToken, async (req, res) => {
  try {
    authData = jwt.verify(req.headers['x-access-token'], process.env.TOKEN_KEY);

    DB.getDbInstance().query(`CALL getAllCustomers()`, (err, result) => {
      if (err) {
        res.status(400).send('An error occurred');
      } else {
        res.status(200).send(result.length ? result[0] : []);
      }
    });
  } catch {
    res.status(400).send('An error occurred');
  }
});

module.exports = router;
