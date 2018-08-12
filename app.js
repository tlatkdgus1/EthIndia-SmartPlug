const express = require('express');
const router = express.Router();

const app = express();
const db = require('./database/db.js'); 
const bodyParser = require('body-parser');
const userRouter = require('./user_route/user.js');
const deviceRouter = require('./device_route/device.js');

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
db();

app.use('/user', userRouter);
app.use('/device', deviceRouter);
app.use(express.static('views'));

app.listen(80, () => {
  console.log('Express App on port 80!');
});

