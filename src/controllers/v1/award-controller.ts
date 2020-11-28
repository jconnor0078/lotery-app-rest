/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import Awards from "../../mongo/models/award";
import getError from "../../mongo/models/error-helper";

const createAward = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("method createAward -> req.body: ", req.body);
    const { nums, lotery, playDate } = req.body;

    const exist = await Awards.findOne({
      playDate,
    });

    if (
      exist &&
      exist.lotery &&
      exist.lotery.toString().trim() === lotery.trim().toString()
    ) {
      res.status(400).send({
        status: "BAD_REQUEST",
        message: "this lotery has an award inserted with the same date.",
        data: null,
      });
      return;
    }

    const data = await Awards.create({
      nums,
      lotery,
      playDate,
      creatorUser: req.sessionData.userId,
    });
    res.send({ status: "OK", message: "award created", data });
  } catch (error) {
    console.log("***ERROR AWARD LOTERY***", error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

const updateAward = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("method updateAward -> req.body: ", req.body);
    const { awardId, nums, lotery, playDate } = req.body;

    if (!awardId) {
      res.status(400).send({
        status: "BAD_REQUEST",
        message: "awardId invalid.",
        data: null,
      });
      return;
    }

    const exist = await Awards.findOne({
      playDate,
    });

    if (
      exist &&
      exist.lotery &&
      exist.lotery.toString().trim() === lotery.toString().trim() &&
      exist._id.toString().trim() !== awardId.toString().trim()
    ) {
      res.status(400).send({
        status: "BAD_REQUEST",
        message: "this lotery has a award inserted.",
        data: null,
      });
      return;
    }

    const data = await Awards.findByIdAndUpdate(awardId, {
      nums,
      lotery,
      playDate,
      modifierUser: req.sessionData.userId,
    });

    res.send({ status: "OK", message: "award updated", data });
  } catch (error) {
    console.log("***ERROR UPDATING AWARD***", error.code, error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

const deleteAward = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("method deleteAward -> req.body: ", req.body);
    const { awardId } = req.body;
    if (!awardId) {
      throw new Error("missing param awardId");
    }

    await Awards.findByIdAndDelete(awardId);
    res.send({ status: "OK", message: "award deleted", data: null });
  } catch (error) {
    console.log("***ERROR DELETE AWARD***", error.code, error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

const getAwards = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("method getLoteries -> all: ");

    // colocando en select el nombre del campo igual a cero,
    //   le decimos que nos de todos los campos excepto ese
    // si colocamos el nombre del campo igual a uno,
    //  le decimos que solo nos de ese campo y no los otros.
    // nota: no puede tener convinaciones de cero y uno,
    //  porque no se permiten convinaciones de inclucions y excluciones
    const loteries = await Awards.find()
      .select({ __v: 0 })
      .populate("lotery", "_id name")
      .populate("userCreator", "_id userName")
      .populate("userModifier", "_id userName");

    res.send({ status: "OK", message: "", data: loteries });
  } catch (error) {
    console.log("***ERROR SEARCHING ALL LOTERIES***", error.code, error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

export default { createAward, updateAward, deleteAward, getAwards };
