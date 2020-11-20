/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import Loteries from "../../mongo/models/lotery";
import getError from "../../mongo/models/error-helper";

const createLotery = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("method createLotery -> req.body: ", req.body);
    const { name, description, status } = req.body;

    const data = await Loteries.create({
      name,
      description,
      status,
      userCreator: req.sessionData.userId,
    });
    res.send({ status: "OK", message: "lotery created", data });
  } catch (error) {
    console.log("***ERROR CREATING LOTERY***", error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

const updateLotery = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("method updateLotery -> req.body: ", req.body);
    const { loteryId, name, description, status } = req.body;

    if (!loteryId) {
      res.status(400).send({
        status: "BAD_REQUEST",
        message: "loteryId invalid.",
        data: null,
      });
      return;
    }
    const data = await Loteries.findOneAndUpdate(loteryId, {
      name,
      description,
      status,
      userModifier: req.sessionData.userId,
    });

    res.send({ status: "OK", message: "user updated", data });
  } catch (error) {
    console.log("***ERROR UPDATING LOTERY***", error.code, error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

const deleteLotery = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("method deleteLotery -> req.body: ", req.body);
    const { loteryId } = req.body;
    if (!loteryId) {
      throw new Error("missing param loteryId");
    }
    // eliminando el usuario
    await Loteries.findByIdAndDelete(loteryId);
  } catch (error) {
    console.log("***ERROR DELETE LOTERY***", error.code, error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

const getLoteries = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("method getLoteries -> all: ");

    // colocando en select el nombre del campo igual a cero,
    //   le decimos que nos de todos los campos excepto ese
    // si colocamos el nombre del campo igual a uno,
    //  le decimos que solo nos de ese campo y no los otros.
    // nota: no puede tener convinaciones de cero y uno,
    //  porque no se permiten convinaciones de inclucions y excluciones
    const loteries = await Loteries.find().select({ __v: 0 }).populate('userCreator', '_id userName').populate('userModifier', '_id userName');

    res.send({ status: "OK", message: "", data: loteries });
  } catch (error) {
    console.log("***ERROR SEARCHING ALL LOTERIES***", error.code, error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

export default { createLotery, updateLotery, deleteLotery, getLoteries };
