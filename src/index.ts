/* eslint-disable @typescript-eslint/no-non-null-assertion */
import express, { Application } from "express";
import bodyParser from "body-parser";

import mongoose from "mongoose";
import routes from "./routes/v1";
import varConfig from "./modules/config";

const PORT = varConfig.port || 4000;

const app: Application = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

routes(app);

mongoose
  .connect(process.env.MONGO!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Conected to Mongo DB");
    app.listen(PORT, () => {
      console.log(`running on ${PORT} PORT`);
    });
  })
  .catch((error) => {
    console.log("ERROR MONGO DB: ", error);
  });
