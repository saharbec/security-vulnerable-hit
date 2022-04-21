const router = require('express').Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const passwordConfig = require('../config');
const DB = require('../database');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    DB.getDbInstance().query(
      `SELECT salt,failedLoginAttempts FROM users where email='${email}'`,
      (error, results) => {
        if (error) {
          res.status(400).send('An error occurred, error code : 31');
          console.log(error);
          return;
        }
        if (results.length === 0) {
          res.status(400).send('User name is incorrect');
          return;
        }
        const { salt, failedLoginAttempts } = results[0];
        if (failedLoginAttempts >= passwordConfig['maximum attempts']) {
          res
            .status(400)
            .send(
              'your account has been disabled for too many failed attempts'
            );
          return;
        }
        const hashedPassword = crypto
          .createHash('sha1')
          .update(salt + password)
          .digest('hex');
        DB.getDbInstance().query(
          `SELECT id, oldPasswords FROM users where email='${email}' and password='${hashedPassword}'`,
          (error, results) => {
            if (error) {
              res.status(400).send('An error occurred, error code : 32');
              return;
            }
            if (results.length === 0) {
              res.status(400).send('User password is incorrect');
              DB.getDbInstance().query(
                `UPDATE users SET failedLoginAttempts = failedLoginAttempts+1 WHERE email = '${email}'`
              );
              return;
            }
            const { id, oldPasswords } = results[0];
            DB.getDbInstance().query(
              `UPDATE users SET failedLoginAttempts = 0 WHERE email = '${email}'`
            );
            token = jwt.sign(
              { user: { id, email, hashedPassword, oldPasswords, salt } },
              process.env.TOKEN_KEY
            );
            res.json({ token });
          }
        );
      }
    );
  } catch {
    res.status(400).send('An error occurred, error code : 33');
  }
});

module.exports = router;
