/* eslint-disable no-bitwise */
import { Request, Response } from "express";
import Loteries from "../../mongo/models/lotery";
import getError from "../../mongo/models/error-helper";

const getDataForScreen = async (req: Request, res: Response): Promise<void> => {
  try {
    const { screenId } = req.params;
    console.log("get data for pantalla -> req.body: ", req.body);

    if (!screenId || screenId.trim() === "0") {
      res.status(400).send({
        status: "BAD_REQUEST",
        message: "screenId invalid.",
        data: null,
      });
      return;
    }

    if (screenId === "1") {
      const loteries = await Loteries.find().select({ _id: 1, name: 1 });

      res.send({ status: "OK", message: "", data: { loteries } });
    } else {
      res.send({ status: "OK", message: "", data: { loteries: [] } });
    }
  } catch (error) {
    console.log("***ERROR GETTING DATA FOR SCREEN***", error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

export default { getDataForScreen };
