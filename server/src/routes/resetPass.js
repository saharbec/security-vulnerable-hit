const router = require('express').Router();
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const passwordValidation = require('../middlewares/passwordValidation.js');
const passwordConfig = require('../config.json');
const DB = require('../database/index.js');

router.post('/resetpass', passwordValidation, async (req, res) => {
  try {
    const { id, token, newPassword } = req.body;
    DB.getDbInstance().query(
      'SELECT * FROM users where id=(?)',
      [id],
      async (error, results, fields) => {
        // if SQL Error
        if (error) {
          res.status(400).send('An error occurred');
          return;
        }
        if (!results.length) {
          // ID not in DB
          res.status(400).send('Invalid id');
          return;
        }
        const { password, oldPasswords } = results[0];
        // validate token
        const userKey = crypto
          // Created hash object
          .createHash('sha1')
          // Update data
          .update(password)
          // Encoding to be used
          .digest('hex');
        if (token != userKey) {
          res.status(400).send('Invalid token');
          return;
        }
        let oldPasswordsArr =
          oldPasswords === null ? [] : oldPasswords.split(',');
        oldPasswordsArr = [currenHashedPassword, ...oldPasswordsArr].slice(
          0,
          passwordConfig.history
        );
        const newHashedPassword = crypto
          .createHash('sha1')
          .update(newPassword)
          .digest('hex');
        for (let i = 0; i < oldPasswordsArr.length; i++) {
          if (newHashedPassword === oldPasswordsArr[i]) {
            res.status(400).send('You have already used this password');
            return;
          }
        }
        const oldPasswordsStr = oldPasswordsArr.join(',');
        DB.getDbInstance().query(
          `UPDATE users SET password = '${newHashedPassword}' , oldPasswords = '${oldPasswordsStr}' WHERE id = '${id}'`
        );
        res.status(200).send('password changed');
      }
    );
  } catch (error) {
    console.log(error);
    res.status(400).send('An error occurred');
  }
});

async function checkIfPassExists(password, previousPasswords) {
  passNotMatched = true;
  for (let i = 0; i < previousPasswords.length; i++) {
    const resultOfCompa = await bcrypt.compare(password, previousPasswords[i]);
    if (resultOfCompa) {
      passNotMatched = false;
    }
  }
  return passNotMatched;
}

module.exports = router;
