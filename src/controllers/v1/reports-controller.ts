/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Request, Response } from "express";
import {
  getHeaderSalesSummaryHtmlStr,
  getAwardsByDates,
  getFinalSummary,
  getFinalSummaryHtmlStr,
} from "../../modules/reports-module";
import getError from "../../mongo/models/error-helper";

const salesSummaryReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log("method salesSummaryReport -> all: ");
    const {
      from,
      to,
      isAward,
      isFinalSummary,
      isWinnerTicket,
      isNullTicket,
      isPaidTicket,
    } = req.body;

    if (
      !from ||
      from.toString().trim() === "" ||
      from.split("-").length !== 3
    ) {
      res.status(202).send({
        status: "ACCEPT_WITH_BAD_REQUEST",
        message: "field from invalid",
        data: null,
      });
      return;
    }
    if (!to || to.toString().trim() === "" || to.split("-").length !== 3) {
      res.status(202).send({
        status: "ACCEPT_WITH_BAD_REQUEST",
        message: "field to invalid",
        data: null,
      });
      return;
    }
    const fromDate = new Date(
      from.split("-")[0],
      from.split("-")[1] - 1,
      from.split("-")[2],
      0,
      0,
      0,
      0
    );
    const toDate = new Date(
      to.split("-")[0],
      to.split("-")[1] - 1,
      to.split("-")[2],
      23,
      59,
      59,
      999
    );
    let awardsObj: any = null;
    let html = getHeaderSalesSummaryHtmlStr(fromDate, toDate, "Banca Maria");

    if (isAward) {
      const data = await getAwardsByDates(fromDate, toDate);
      awardsObj = data.data;
      html += data.htmlStr;
    }
    let finalSummary = 0;
    if (isFinalSummary) {
      const total = await getFinalSummary(
        fromDate,
        toDate,
        req.sessionData.userId
      );
      finalSummary = total;
      html += getFinalSummaryHtmlStr(total);
    }

    res.send({
      status: "OK",
      message: "",
      data: { awards: awardsObj, finalSummary, htmlStr: html },
    });
  } catch (error) {
    console.log("***ERROR REPORT SALES SUMMARY***", error.code, error);
    const errorFormated = getError(error);
    res.status(errorFormated.code).send(errorFormated.error);
  }
};

export default { salesSummaryReport };
