/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import express, { Application, Request } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes/v1";
import varConfig from "./modules/config";

const PORT = varConfig.port || 4000;

const app: Application = express();

// declarando un nuevo tipo de datos (sessionData) en el modulo express clase Request
//    o en pocas palabra agregando un nuevo campo en el objeto Request de Express
declare global {
  namespace Express {
    export interface Request {
      sessionData: any;
    }
  }
}
// ****************************************************************** */

// enable CORS without external module
app.use(cors());

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
