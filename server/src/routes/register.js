const router = require('express').Router();
const crypto = require('crypto');
const shasum = crypto.createHash('sha1');

const { db } = require('../database/index.js');
const passwordValidation = require('../middlewares/passwordValidation.js');

router.post('/register', passwordValidation, async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    // if (!passwordValidation(password)) { res.status(400).send("Password must meet minimum requirements"); return; }
    const salt = crypto.randomBytes(10).toString('base64');
    shasum.update(salt + password);
    const hashedPassword = shasum.digest('hex');
    db.query(
      `INSERT INTO users (email,password,firstName,lastname,salt) VALUES ('${email}','${hashedPassword}','${firstName}','${lastName}','${salt}')`,
      (err, result) => {
        if (err) {
          res.status(500).send('An error occurred, error code : 11');
          return;
        }
        res.status(200).send('User created successfully');
      }
    );
  } catch (error) {
    res.status(500).send('An error occurred, error code : 12');
  }
});

module.exports = router;
