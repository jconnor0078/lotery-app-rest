import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import varConfig from "../modules/config";

const isValidHost = (req: Request, res: Response, next: NextFunction): void => {
  const arrHost: string[] = ["localhost", "google.com"];
  if (arrHost.includes(req.hostname)) {
    next();
  } else {
    res.status(403).send({
      status: "ACCESS_DENIED",
      message: "host invalid.",
      data: null,
    });
  }
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

export { isValidHost, isAuth };
