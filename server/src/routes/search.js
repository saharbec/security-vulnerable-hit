const router = require('express').Router();
const jwt = require('jsonwebtoken');

const DB = require('../database');
const verifyToken = require('../middlewares/auth');

router.get('/search', verifyToken, async (req, res) => {
  try {
    authData = jwt.verify(req.headers['x-access-token'], process.env.TOKEN_KEY);

    DB.getDbInstance().query(
      `SELECT id, name, email FROM customers WHERE name LIKE '%${req.query.term}%'`, // !SQL INJECTION
      [authData.user.email],
      (err, result) => {
        if (err) {
          res.status(400).send('An error occurred');
        } else {
          res.status(200).send(result);
        }
      }
    );
  } catch {
    res.status(400).send('An error occurred');
  }
});

// router.post("/Search", verifyToken, async (req, res) => {
//     try {
//         authData = jwt.verify(req.headers["x-access-token"], config.TOKEN_KEY)
//         result = DB.getDbInstance().query("SELECT id, name, email FROM customers WHERE title LIKE (?)",
//             [authData.user.email, `%${req.query.term}%`])
// !SQL INJECTION SOLUTION

//         console.log(result)
//         // res.status(200).send(result);
//         res.json({result})
//     } catch(error) {
//         console.log(error)
//         res.status(400).send("An error occurred");
//     }
// });

module.exports = router;
