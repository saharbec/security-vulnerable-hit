const router = require('express').Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const verifyToken = require('../middlewares/auth');
const passwordValidation = require('../middlewares/passwordValidation.js');
const passwordConfig = require('../config.json');
const { db } = require('../database');
const DB = require('../database');

router.post(
  '/changePassword',
  passwordValidation,
  verifyToken,
  async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    jwt.verify(
      req.headers['x-access-token'],
      process.env.TOKEN_KEY,
      (error, authData) => {
        const { id, email, hashedPassword, oldPasswords, salt } = authData.user;
        if (error) {
          console.log(error);
          res.status(400).send('An authentication error occurred');
          return;
        }
        const currenHashedPassword = crypto
          .createHmac('sha1', salt)
          .update(currentPassword)
          .digest('hex');
        if (currenHashedPassword != hashedPassword) {
          res.status(400).send('Password is incorrect');
          return;
        }
        const newHashedPassword = crypto
          .createHmac('sha1', salt)
          .update(newPassword)
          .digest('hex');
        const oldPasswordsArr = [
          currenHashedPassword,
          ...(oldPasswords || []),
        ].slice(0, passwordConfig.history);
        for (let i = 0; i < oldPasswordsArr.length; i++) {
          if (newHashedPassword === oldPasswordsArr[i]) {
            res.status(400).send('You have already used this password');
            return;
          }
        }
        DB.getDbInstance().query(
          `UPDATE users SET password = '${newHashedPassword}' WHERE email = '${email}'`
        );
        DB.getDbInstance().query(
          `INSERT INTO passwords (password, user_id) VALUES ('${newHashedPassword}', '${id}')`
        );
        const token = jwt.sign(
          {
            user: {
              id,
              email,
              hashedPassword: newHashedPassword,
              salt,
              oldPasswords: oldPasswordsArr,
            },
          },
          process.env.TOKEN_KEY
        );
        res.status(200).send({ token });
      }
    );
  }
);

module.exports = router;
