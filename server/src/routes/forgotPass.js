const router = require('express').Router();
const crypto = require('crypto');

const DB = require('../database');

const clientIp = process.env.CLIENT_IP;
const frontPort = process.env.CLIENT_PORT;

router.post('/forgotpass', async (req, res) => {
  try {
    const { email } = req.body;
    DB.getDbInstance().query(
      'SELECT * FROM users where email = (?)',
      [email],
      async (error, results, fields) => {
        if (error) {
          res.status(500).send('An error occurred');
          return;
        }
        if (results.length === 0) {
          res.status(400).send('The account not exists');
          return;
        }
        const { id, email, firstName, lastName, password } = results[0];
        const token = crypto.createHash('sha1').update(password).digest('hex');
        const resetPassLink = `http://${clientIp}:${frontPort}/resetpass/${id}/${token}`;
        /* Send reset password mail with reset password link */
        res.status(200).send("Password link has been sent to you're email");
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

module.exports = router;
