/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import varConfig from "../modules/config";

const WHITE_LIST_HOSTS = varConfig.whiteListHosts.split(",");

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const corsOptionsDelegate = (req: any, callback: any) => {
  let corsOptions;
  if (WHITE_LIST_HOSTS.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  if (!corsOptions.origin) {
    callback(new Error("Not allowed by CORS"), corsOptions);
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const { token } = req.headers;
    if (token) {
      // obteniendo la data que trae el token
      const data = jwt.verify(token as string, varConfig.secretJwt);
      // asignandole los datos del token a una nueva variable del
      // req para poder consumirlo en el controller
      req.sessionData = data;
      next();
    } else {
      throw {
        code: 403,
        status: "ACCESS_DENIED",
        message: "missing header token.",
        data: null,
      };
    }
  } catch (error) {
    res.status(error.code || 500).send({
      status: error.status || "ERROR",
      message: error.message,
      data: null,
    });
  }
};

export { corsOptionsDelegate, isAuth };
