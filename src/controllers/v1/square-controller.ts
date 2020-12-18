/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import Users from "../../mongo/models/users";
import Tickets from "../../mongo/models/ticket";
import Squares from "../../mongo/models/square";

import {
  getPendingAmount,
  getLoseAmount,
  getLoterySalesAmount,
} from "../../modules/square-module";
import getError from "../../mongo/models/error-helper";

const getSquareInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("method getSquareInfo ->", req.body);

    // const { quareDate, hh, mm, ss } = req.body;
    const pendingAmount = await getPendingAmount(req.sessionData.userId);
    const loseAmount = await getLoseAmount(req.sessionData.userId);
    const loterySalesAmount = await getLoterySalesAmount(
      req.sessionData.userId
    );

    res.send({
      status: "OK",
      message: "",
      data: { pendingAmount, loseAmount, loterySalesAmount },
    });
  } catch (error) {
    console.log("***ERROR SEARCHING SQUARE+***", error.code, error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

const createSquare = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("method createSquare -> req.body: ", req.body);
    const { amountSquare, userAdminName, userAdminPass } = req.body;

    if (!amountSquare || !userAdminName || !userAdminPass) {
      res.status(202).send({
        status: "ACCEPT_WITH_BAD_REQUEST",
        message: "amountSquare or userAdminName or userAdminPass invalid.",
        data: null,
      });
      return;
    }
    const userAdmin = await Users.findOne({ userName: userAdminName });
    if (userAdmin) {
      if (!userAdmin.roles || userAdmin.roles.indexOf("admin") === -1) {
        res.status(202).send({
          status: "USER_NOT_ADMIN",
          message: "user cant not do a square.",
          data: null,
        });
        return;
      }
      const isOk = await bcrypt.compare(userAdminPass, userAdmin.password);
      if (isOk) {
        // buscando todos los ticket no cuadrados
        const tickets = await Tickets.find({
          isSquare: false,
          creatorUser: req.sessionData.userId,
        });
        if (!tickets || tickets.length < 1) {
          res.status(202).send({
            status: "ACCEPT_WITH_BAD_REQUEST",
            message: "no found ticket for square.",
            data: null,
          });
          return;
        }
        let loterySalesAmount = 0;
        let loseAmount = 0;
        tickets.forEach(async (element) => {
          if (element.statusTicket !== "canceled") {
            loterySalesAmount += element.amountTotal;
            if (
              element.statusTicket === "winner" ||
              element.statusTicket === "paid"
            ) {
              loseAmount += element.amountTotal;
            }
            await Tickets.findByIdAndUpdate(element._id, { isSquare: true });
          }
        });
        const amountToDeliver = loterySalesAmount - loseAmount;
        const auxPendingAmount = await getPendingAmount(req.sessionData.userId);
        const pendingAmount = auxPendingAmount + amountToDeliver - amountSquare;

        const data = await Squares.create({
          regDate: new Date(),
          pendingAmount,
          loseAmount,
          loterySalesAmount,
          amountToDeliver,
          amountDelivered: amountSquare,
          user: req.sessionData.userId,
          userOfSquare: userAdmin._id,
        });
        res.send({ status: "OK", message: "square created", data });
      } else {
        res.status(403).send({
          status: "INVALID_CREDENTIALS",
          message: "user or password invalid.",
          data: null,
        });
        return;
      }
    } else {
      res.status(403).send({
        status: "INVALID_CREDENTIALS",
        message: "user admin or password invalid.",
        data: null,
      });
      return;
    }
  } catch (error) {
    console.log("***ERROR CREATING SQUARE***", error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};
export default { getSquareInfo, createSquare };
