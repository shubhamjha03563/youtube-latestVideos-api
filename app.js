const express = require('express');
require('colors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/error');
const youtubeApiCaller = require('./middlewares/youtubeApiCaller');
const schedule = require('node-schedule');

const app = express();

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// dotenv config
dotenv.config({ path: './vars.env' });

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    app.listen(process.env.PORT, () => {
      console.log(`Listening to port ${process.env.PORT}...`.cyan.bold);
    }),
    console.log('Connected to database.'.yellow.bold)
  )
  .catch((err) => {
    console.log(err);
    console.log('Error connecting to database !'.red.bold);
  });

const apiRoutes = require('./routes/apiRoutes');

// Mount routers
app.use('/api', apiRoutes);

// Unhandled routes
app.all('*', (req, res, next) => {
  next(new AppError(`Requested URL not found - ${req.url}`, 404));
});

app.use(errorHandler);

schedule.scheduleJob('*/15 * * * * *', youtubeApiCaller);

app.use(youtubeApiCaller); // youtube api caller

process.on('unhandledRejection', (err) => {
  console.log(err);
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION!SERVER SHUT DOWN!'.bold.red);
  process.exit(1);
});
