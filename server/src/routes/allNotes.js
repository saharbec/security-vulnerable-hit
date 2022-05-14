const router = require('express').Router();
const jwt = require('jsonwebtoken');

const DB = require('../database');
const verifyToken = require('../middlewares/auth');

router.get('/notes', verifyToken, async (req, res) => {
  try {
    authData = jwt.verify(req.headers['x-access-token'], process.env.TOKEN_KEY);

    DB.getDbInstance().query(
      `SELECT id, title, content FROM notes`,
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
//         result = DB.getDbInstance().query("SELECT title , content FROM notes WHERE email = (?) AND title LIKE (?)",
//             [authData.user.email, `%${req.body.search}%`])

//         console.log(result)
//         // res.status(200).send(result);
//         res.json({result})
//     } catch(error) {
//         console.log(error)
//         res.status(400).send("An error occurred");
//     }
// });

module.exports = router;
