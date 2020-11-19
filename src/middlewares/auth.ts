import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

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

export { isValidHost };
