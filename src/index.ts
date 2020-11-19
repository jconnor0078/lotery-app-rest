import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// const routes = require('./routes/v1');

dotenv.config();

const PORT = process.env.PORT || 4000;

const app: Application = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// routes(app);

mongoose
  .connect(process.env.MONGO!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Conected to Mongo DB');
    app.listen(PORT, () => {
      console.log(`running on ${PORT} PORT`);
    });
  })
  .catch((error) => {
    console.log('ERROR MONGO DB: ', error);
  });
