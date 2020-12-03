/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Awards from "../mongo/models/award";

const getConditionsAwards = (loteries: any): any => {
  const res: any = [];
  loteries.forEach((element: any) => {
    res.push({ lotery: element._id });
  });
  return res;
};

const getAmountWinQui = (loteryPlays: any, awards: any): number => {
  let result = 0;
  loteryPlays.forEach((loteryPlay: any) => {
    if (loteryPlay.type === "Qui") {
      awards.forEach((award: any) => {
        // validando salida en primera
        if (loteryPlay.num === award.nums.num1st) {
          result += loteryPlay.amount * award.lotery.peyPerWin.first;
        }
        // validando salida en segunda
        if (loteryPlay.num === award.nums.num2th) {
          result += loteryPlay.amount * award.lotery.peyPerWin.second;
        }
        // validando salida en tercera
        if (loteryPlay.num === award.nums.num3th) {
          result += loteryPlay.amount * award.lotery.peyPerWin.third;
        }
      });
    }
  });
  return result;
};

const getAmountWinTrip = (loteryPlays: any, awards: any): number => {
  let result = 0;
  loteryPlays.forEach((loteryPlay: any) => {
    if (loteryPlay.type === "Trip") {
      awards.forEach((award: any) => {
        let res = false;
        const tripPlayArr = [
          loteryPlay.num.trim()[0].trim() + loteryPlay.num.trim()[1].trim(),
          loteryPlay.num.trim()[2].trim() + loteryPlay.num.trim()[3].trim(),
          loteryPlay.num.trim()[4].trim() + loteryPlay.num.trim()[5].trim(),
        ];
        const tripAward = [
          award.nums.num1st.trim(),
          award.nums.num2th.trim(),
          award.nums.num3th.trim(),
        ];
        tripPlayArr.sort();
        tripAward.sort();
        res = tripPlayArr.every((v, i) => v === tripAward[i]);
        if (res) {
          result += loteryPlay.amount * award.lotery.peyPerWin.trip;
        }
      });
    }
  });
  return result;
};

const getAmountWinner = async (ticket: any): Promise<number> => {
  let result = 0;
  // buscando el ganador del dia de ese ticket
  const tDate = new Date(ticket.regDate);
  const dateAward = new Date(
    `${tDate.getFullYear()}-${tDate.getMonth() + 1}-${tDate.getDate()}`
  );
  const awards = await Awards.find({
    $and: [
      {
        $or: getConditionsAwards(ticket.lotteries), // and operator body finishes
      },
      { playDate: dateAward },
    ],
  })
    .select({ nums: 1 })
    .populate("lotery", "_id name peyPerWin");

  if (!awards || awards.length < 1) {
    return 0;
  }
  // buscando el monto ganador en quinielas
  result += getAmountWinQui(ticket.loteryPlays, awards);
  // buscando el monto ganador en quinielas
  result += getAmountWinTrip(ticket.loteryPlays, awards);

  return result;
};

export { getAmountWinner };
