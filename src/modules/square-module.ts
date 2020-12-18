/* eslint-disable no-return-await */
import tickets, { ITicket } from "../mongo/models/ticket";
import squares from "../mongo/models/square";

const getLastQuare = async (user: string) =>
  await squares.findOne({ user }).sort({ regDate: -1 });

const getPendingAmount = async (user: string): Promise<number> => {
  let res = 0;

  const data = await getLastQuare(user);

  if (data) {
    res = data.pendingAmount;
  }
  return res;
};

const getLoseAmount = async (user: string): Promise<number> => {
  let res = 0;

  const data = await tickets.find({
    isSquare: false,
    creatorUser: user,
  });

  if (data && data.length > 0) {
    data.forEach((element) => {
      if (
        element.statusTicket === "winner" ||
        element.statusTicket === "paid"
      ) {
        res += element.amountTotal;
      }
    });
  }
  return res;
};

const getLoterySalesAmount = async (user: string): Promise<number> => {
  let res = 0;

  const data = await tickets.find({
    isSquare: false,
    creatorUser: user,
  });

  if (data && data.length > 0) {
    data.forEach((element) => {
      if (element.statusTicket !== "canceled") {
        res += element.amountTotal;
      }
    });
  }
  return res;
};

export { getPendingAmount, getLoseAmount, getLoterySalesAmount };
