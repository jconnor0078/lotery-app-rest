import { ILotery } from "../mongo/models/lotery";
/* eslint-disable no-plusplus */
/* eslint-disable space-in-parens */
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

const getAmountWinPale = (
  loteryPlays: any,
  awards: any,
  superPaleLotteries: any
): number => {
  let result = 0;
  loteryPlays.forEach((loteryPlay: any) => {
    if (
      loteryPlay.type === "Pale" &&
      (!superPaleLotteries || superPaleLotteries.length < 1)
    ) {
      awards.forEach((award: any) => {
        const pN1 = (
          loteryPlay.num[0].trim() + loteryPlay.num[1].trim()
        ).trim();
        const pN2 = (
          loteryPlay.num[2].trim() + loteryPlay.num[3].trim()
        ).trim();
        // validando pale tipo  1ro 2do
        if (
          (pN1 === award.nums.num1st && pN2 === award.nums.num2th) ||
          (pN2 === award.nums.num1st && pN1 === award.nums.num2th)
        ) {
          result += loteryPlay.amount * award.lotery.peyPerWin.pale1st2nd;
        }
        // validando pale tipo  1ro 3ro
        if (
          (pN1 === award.nums.num1st && pN2 === award.nums.num3th) ||
          (pN2 === award.nums.num1st && pN1 === award.nums.num3th)
        ) {
          result += loteryPlay.amount * award.lotery.peyPerWin.pale1st3rd;
        }
        // validando pale tipo  2do 3ro
        if (
          (pN1 === award.nums.num2th && pN2 === award.nums.num3th) ||
          (pN2 === award.nums.num2th && pN1 === award.nums.num3th)
        ) {
          result += loteryPlay.amount * award.lotery.peyPerWin.pale2nd3rd;
        }
      });
    }
  });
  return result;
};

const getAmountWinSuperPale = async (
  loteryPlays: any,
  dateLotery: Date,
  superPaleLotteries: any
): Promise<number> => {
  let result = 0;
  if (!superPaleLotteries || superPaleLotteries.length < 1) {
    return 0;
  }
  const awards = await Awards.find({
    $and: [
      {
        $or: getConditionsAwards(superPaleLotteries), // and operator body finishes
      },
      { playDate: dateLotery },
    ],
  })
    .select({ nums: 1 })
    .populate("lotery", "_id name peyPerWin");

  if (!awards || awards.length < 1 || awards.length !== 2) {
    return 0;
  }

  loteryPlays.forEach((loteryPlay: any) => {
    if (loteryPlay.type === "Pale") {
      const pN1 = (loteryPlay.num[0].trim() + loteryPlay.num[1].trim()).trim();
      const pN2 = (loteryPlay.num[2].trim() + loteryPlay.num[3].trim()).trim();
      const lot1 = awards[0].nums.num1st.trim();
      const lot2 = awards[1].nums.num1st.trim();
      // validando super pale
      if ((pN1 === lot1 && pN2 === lot2) || (pN2 === lot1 && pN1 === lot2)) {
        const loteryFull = awards[0].lotery as ILotery;
        result += loteryPlay.amount * loteryFull.peyPerWin.superPale;
      }
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
        console.log("tripleta", tripPlayArr);
        console.log("ganadores", tripAward);
        res = tripPlayArr.every((v, i) => v === tripAward[i]);
        if (res) {
          result += loteryPlay.amount * award.lotery.peyPerWin.trip;
        } else {
          // verificar si por lo menos dos numeros de la tripleta son iguales
          const arrayIndexs: any = [];
          tripPlayArr.forEach((element) => {
            for (let index = 0; index < tripAward.length; index++) {
              if (element === tripAward[index]) {
                arrayIndexs.push(index);
              }
            }
          });
          const arrayIndexUnique = arrayIndexs.filter(
            (item: any, index: any) => arrayIndexs.indexOf(item) === index
          );
          if (arrayIndexUnique && arrayIndexUnique.length === 2) {
            result += loteryPlay.amount * award.lotery.peyPerWin.tripTwoSame;
          }
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
  // buscando el monto ganador en Pale
  result += getAmountWinPale(
    ticket.loteryPlays,
    awards,
    ticket.superPaleLotteries
  );
  // buscando el monto ganador del super pale
  result += await getAmountWinSuperPale(
    ticket.loteryPlays,
    dateAward,
    ticket.superPaleLotteries
  );
  // buscando el monto ganador en quinielas
  result += getAmountWinTrip(ticket.loteryPlays, awards);

  return result;
};

export { getAmountWinner };
