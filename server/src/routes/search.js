const router = require('express').Router();
const jwt = require('jsonwebtoken');

const DB = require('../database');
const verifyToken = require('../middlewares/auth');

const IS_STORED_PROCEDURE = true;

router.get('/search', verifyToken, async (req, res) => {
  try {
    authData = jwt.verify(req.headers['x-access-token'], process.env.TOKEN_KEY);

    const query = IS_STORED_PROCEDURE
      ? `CALL searchCustomers('${req.query.term}')` // !SQL INJECTION SOLUTION WITH STORED PROCEDURE
      : `SELECT id, name, email FROM customers WHERE name = '${req.query.term}'`; // !SQL INJECTION

    DB.getDbInstance().query(query, [authData.user.email], (err, result) => {
      if (err) {
        res.status(400).send('An error occurred');
      } else {
        res.status(200).send(IS_STORED_PROCEDURE ? result[0] : result);
      }
    });
  } catch {
    res.status(400).send('An error occurred');
  }
});

// router.post("/Search", verifyToken, async (req, res) => {
//     try {
//         authData = jwt.verify(req.headers["x-access-token"], config.TOKEN_KEY)
//         result = DB.getDbInstance().query("SELECT id, name, email FROM customers WHERE title  (?)",
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
