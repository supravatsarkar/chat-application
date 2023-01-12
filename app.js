// external modules
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// internal modules
const {
  errorHandler,
  notFoundHandler,
} = require('./middlewares/common/errorHandler');
const loginRouter = require('./router/loginRouter');
const usersRouter = require('./router/usersRouter');
const inboxRouter = require('./router/inboxRouter');

// basic config
dotenv.config();
const port = process.env.PORT || 5000;

// database connection
mongoose
  .set('strictQuery', true)
  .connect(process.env.MONGOOSE_CONNECTION_STRING)
  .then(() => {
    console.log('mongoose connection successful!');
  })
  .catch((err) => console.log(`mongoose connection error: ${err}`));

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// set view engine
app.set('view engine', 'ejs');

//set static directory
app.use(express.static(path.join(__dirname, 'public')));

// parse cookie
app.use(cookieParser(process.env.COOKIE_SECRET));

//app routers
app.use('/', loginRouter);
app.use('/users', usersRouter);
app.use('/inbox', inboxRouter);

// not found hendling
app.use(notFoundHandler);

//error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log('NODE_ENV', process.env.NODE_ENV);
  console.log(`app listening to port ${port}`);
});
