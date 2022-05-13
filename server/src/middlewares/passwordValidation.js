const { passwordRequirements } = require('../config.json');
const fs = require('fs');
const path = require('path');

const passwordValidation = (req, res, next) => {
  const password = req.body.password || req.body.newPassword;
  if (passwordRequirements['min password length'] > password.length) {
    return res
      .status(400)
      .send(
        `password must contain more than ${passwordRequirements['min password length']} characters`
      );
  }
  let valid = true;

  data = fs.readFileSync(
    path.resolve(__dirname, '../../common passwords.txt'),
    'utf8'
  );
  if (data.indexOf(password) >= 0) {
    return res.status(400).send('Password is too common');
  }

  Object.keys(passwordRequirements.character.settings).forEach((key) => {
    if (passwordRequirements.character.settings[key]) {
      let re = new RegExp(passwordRequirements.character.regex[key]);
      if (!re.test(password)) {
        valid = false;
        return res.status(400).send(`password ${key}`);
      }
    }
  });
  if (valid) {
    // return res.status(200).send(`pass`);
    return next();
  }
};

module.exports = passwordValidation;
