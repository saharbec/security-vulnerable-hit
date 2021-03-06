const router = require('express').Router();
const crypto = require('crypto');

const DB = require('../database/index.js');
const passwordValidation = require('../middlewares/passwordValidation.js');

router.post('/register', passwordValidation, async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    // if (!passwordValidation(password)) { res.status(400).send("Password must meet minimum requirements"); return; }
    const salt = crypto.randomBytes(10).toString('base64');
    const hmac = crypto.createHmac('sha1', salt);
    hmac.update(password);
    const hashedPassword = hmac.digest('hex');
    DB.getDbInstance().query(
      // !SQL INJECTION
      `INSERT INTO users (email,password,firstName,lastname,salt) VALUES ('${email}','${hashedPassword}','${firstName}','${lastName}', '${salt}');`,
      (err, result) => {
        if (err) {
          console.error({ err });
          res.status(400).send('An error occurred, error code : 11');
          return;
        }
        DB.getDbInstance().query(
          `INSERT INTO passwords (password, user_id) VALUES ('${hashedPassword}', ${result.insertId})`
        );
        res.status(200).send('User created successfully');
      }
    );
  } catch (error) {
    res.status(400).send('An error occurred, error code : 12');
  }
});

module.exports = router;
