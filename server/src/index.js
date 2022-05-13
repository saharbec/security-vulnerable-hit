const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

require('./database').initDB();
const app = express();
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');

const authMiddleware = require('./middlewares/auth');

const loginRoute = require('./routes/login');
const registerRoute = require('./routes/register');
const addNoteRoute = require('./routes/addNote');
const searchRoute = require('./routes/search');
const removeNoteRoute = require('./routes/removeNote');
const changePassRoute = require('./routes/changePass');
const forgotPassRoute = require('./routes/forgotPass');
const resetPassRoute = require('./routes/resetPass');

const PORT = process.env.PORT;

app.use(cors());
// Parse URL-encoded body
app.use(express.urlencoded({ extended: true }));
// Parse JSON body
app.use(express.json());

// readFileSync because we get vital configuration data which is required to start the server
const options = {
  key: fs.readFileSync(path.resolve(__dirname, '../../cert/key.pem')),
  cert: fs.readFileSync(path.resolve(__dirname, '../../cert/cert.pem')),
};

const tlsServer = https.createServer(options, app);

tlsServer.listen(PORT, () => {
  console.log(`TLS Server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Server is up and running');
});

app.get('/passwordRequirements', (req, res) => {
  res.send(require('./config')['password requirements']);
});

app.get('/authentication_status', authMiddleware, (req, res) => {
  res.status(200).send();
});

app.post('/test', (req, res) => {
  console.log(req.body);
  res.status(200).send('test');
});

app.post('/login', loginRoute);
app.post('/register', registerRoute);
app.post('/addNote', addNoteRoute);
app.post('/search', searchRoute);
app.post('/removeNote', removeNoteRoute);
app.post('/changePassword', changePassRoute);
app.post('/forgotpass', forgotPassRoute);
app.post('/resetpass', resetPassRoute);
