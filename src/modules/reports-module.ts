/* eslint-disable no-useless-concat */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-use-before-define */
import Awards from "../mongo/models/award";
import Tickets from "../mongo/models/ticket";

const getAwardsByDates = async (from: Date, to: Date) => {
  const data = await Awards.find({
    playDate: { $gte: from, $lte: to },
  })
    .select({ playDate: 1, nums: 1, lotery: 1 })
    .populate("lotery", "_id name");
  let res: { data: any; htmlStr: any } = { data: [], htmlStr: "" };
  if (data && data.length > 0) {
    res = getAwardsHtmlStr(data);
  }
  return res;
};

const getFinalSummary = async (from: Date, to: Date, user: string) => {
  let res = 0;
  const data = await Tickets.find({
    createdAt: { $gte: from, $lte: to },
    creatorUser: user,
  });
  if (data && data.length > 0) {
    data.forEach((element) => {
      res += element.amountTotal;
    });
  }
  return res;
};
const getHeaderSalesSummaryHtmlStr = (
  from: Date,
  to: Date,
  bancaName: string
): string => {
  const fromStr = `${from.getDate()}-${
    from.getMonth() + 1
  }-${from.getFullYear()}`;
  const toStr = `${to.getDate()}-${to.getMonth() + 1}-${to.getFullYear()}`;
  const todayStr = `${new Date().getDate()}-${
    new Date().getMonth() + 1
  }-${new Date().getFullYear()}`;
  return `<div style="text-align: center;"><h3>Consorcio de Bancas</h3><strong>${bancaName}</strong><br>-----------------------------------------<br>Desde=&gt; ${fromStr}<br>Hasta =&gt; ${toStr}<br>Impreso =&gt; ${todayStr}<br><br></div>`;
};
const getAwardsHtmlStr = (data: any) => {
  const arr: { lotery: any; nums: any }[] = [];
  let htmlStr = "";
  htmlStr +=
    '<div style="text-align: center;"><strong>Premios</strong><br>-----------------------------------------<br>' +
    "Loterias&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1ro-2do-3ro<br>" +
    "-----------------------------------------<br>" +
    '<div style="text-align:-webkit-center;"><div style="width:191px;"><table style="width:100%">';
  data.forEach((element: any) => {
    arr.push({ lotery: element.lotery, nums: element.nums });
    htmlStr += `<tr><td style="text-align:left; border: none">${element.lotery.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td><td style="text-align:right; border: none">${element.nums.num1st}-${element.nums.num2th}-${element.nums.num3th}</td></tr>`;
  });
  htmlStr += `</table></div><div>`;
  return { data: arr, htmlStr };
};

const getFinalSummaryHtmlStr = (total: number) => {
  const htmlStr =
    '<div><strong>Resumen Final</strong><br>-----------------------------------------<br><div style="text-align:-webkit-center;">' +
    '<div style="width:191px;"><table style="width:100%"><tr><td style="text-align:left; border: none">Resumen Final&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>' +
    `<td style="text-align:right; border: none">${total}</td></tr></table></div></div>`;
  return htmlStr;
};
export { getAwardsByDates, getHeaderSalesSummaryHtmlStr, getFinalSummary, getFinalSummaryHtmlStr };
