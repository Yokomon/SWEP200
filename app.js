const cookieParser = require('cookie-parser');
const express = require('express');
const httpErrors = require('http-errors');
const logger = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const db = require('./config/database');
require('dotenv').config();


const indexRouter = require('./routes/index');
const teacherRouter = require('./routes/teacher');
const studentRouter = require('./routes/student');


const app = express();

// Database Connection
mongoose.connect(db.mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to Database...'))
  .catch(err => console.log(err));

app.set('views', path.join(__dirname, 'views'));
// view engine setup
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/lecturer', teacherRouter);
app.use('/student', studentRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(httpErrors(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
