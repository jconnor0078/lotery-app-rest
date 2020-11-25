/* eslint-disable no-bitwise */

import { Request, Response } from "express";
import QRCode from "qrcode";
import Tickets from "../../mongo/models/ticket";
import getError from "../../mongo/models/error-helper";

const getDateUnique = (): string =>
  new Date().getDay().toString() +
  new Date().getMonth().toString() +
  new Date().getFullYear().toString() +
  new Date().getHours().toString() +
  new Date().getMinutes().toString() +
  new Date().getSeconds().toString() +
  new Date().getMilliseconds().toString();

const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("method createTicket -> req.body: ", req.body);

    const {
      loteryPlays,
      amountTotal,
      lotteries,
      superPaleLotteries,
    } = req.body;
    const codigoUnico = parseInt(getDateUnique(), 10);
    const codigoQR = await QRCode.toDataURL(`{ id: ${codigoUnico}`);
    const dataCreate = await Tickets.create({
      qrCode: codigoQR,
      code: codigoUnico,
      regDate: new Date(),
      loteryPlays,
      amountTotal,
      lotteries,
      superPaleLotteries,
      creatorUser: req.sessionData.userId,
    });
    res.send({ status: "OK", message: "ticket created", data: dataCreate });
  } catch (error) {
    console.log("***ERROR CREATING TICKET***", error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

const getTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("method getTickets -> all: ");

    // colocando en select el nombre del campo igual a cero,
    //   le decimos que nos de todos los campos excepto ese
    // si colocamos el nombre del campo igual a uno,
    //  le decimos que solo nos de ese campo y no los otros.
    // nota: no puede tener convinaciones de cero y uno,
    //  porque no se permiten convinaciones de inclucions y excluciones
    const tickets = await Tickets.find()
      .populate("lotteries", "name")
      .populate("superPaleLotteries", "name")
      .populate("creatorUser", "_id userName")
      .populate("modifierUser", "_id userName");

    res.send({ status: "OK", message: "", data: tickets });
  } catch (error) {
    console.log("***ERROR SEARCHING ALL TICKETS***", error.code, error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

const getTicketById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketId } = req.params;
    console.log(`method getTicketById -> ${ticketId}`);

    if (!ticketId) {
      res.status(400).send({
        status: "BAD_REQUEST",
        message: "ticketId invalid.",
        data: null,
      });
      return;
    }

    // colocando en select el nombre del campo igual a cero,
    //   le decimos que nos de todos los campos excepto ese
    // si colocamos el nombre del campo igual a uno,
    //  le decimos que solo nos de ese campo y no los otros.
    // nota: no puede tener convinaciones de cero y uno,
    //  porque no se permiten convinaciones de inclucions y excluciones
    const tickets = await Tickets.findOne({ _id: ticketId })
      .populate("lotteries", "name")
      .populate("superPaleLotteries", "name")
      .populate("creatorUser", "_id userName")
      .populate("modifierUser", "_id userName");

    res.send({ status: "OK", message: "", data: tickets });
  } catch (error) {
    console.log("***ERROR SEARCHING TICKET BY ID***", error.code, error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

const getTicketByCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { ticketCode } = req.params;
    console.log(`method getTicketByCode -> ${ticketCode}`);

    if (!ticketCode) {
      res.status(400).send({
        status: "BAD_REQUEST",
        message: "ticketId invalid.",
        data: null,
      });
      return;
    }
    const ticketCodeNum = parseInt(ticketCode, 10);
    // colocando en select el nombre del campo igual a cero,
    //   le decimos que nos de todos los campos excepto ese
    // si colocamos el nombre del campo igual a uno,
    //  le decimos que solo nos de ese campo y no los otros.
    // nota: no puede tener convinaciones de cero y uno,
    //  porque no se permiten convinaciones de inclucions y excluciones
    const tickets = await Tickets.findOne({ code: ticketCodeNum })
      .populate("lotteries", "_id name")
      .populate("superPaleLotteries", "_id name")
      .populate("creatorUser", "_id userName")
      .populate("modifierUser", "_id userName");

    res.send({ status: "OK", message: "", data: tickets });
  } catch (error) {
    console.log("***ERROR SEARCHING TICKET BY CODE***", error.code, error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

export default { createTicket, getTickets, getTicketById, getTicketByCode };
