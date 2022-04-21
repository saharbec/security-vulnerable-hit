const jwt = require('jsonwebtoken');
const router = require('express').Router();

const DB = require('../database');
const verifyToken = require('../middlewares/auth');

router.post('/addNote', verifyToken, async (req, res) => {
  jwt.verify(
    req.headers['x-access-token'],
    process.env.TOKEN_KEY,
    (error, authData) => {
      if (error) {
        res.status(500).send('An authentication error occurred');
      } else {
        try {
          DB.getDbInstance().query(
            'INSERT INTO notes (email,title,content) VALUES (?,?,?)',
            [authData.user.email, req.body.title, req.body.content],
            (err, result) => {
              if (err) {
                console.log(err);
                res.status(500).send('An error occurred');
              } else {
                res.status(200).send('Node created successfully');
              }
            }
          );
        } catch {
          res.status(500).send('An error occurred');
        }
      }
    }
  );
});

module.exports = router;
