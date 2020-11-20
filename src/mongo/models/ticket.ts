import { Schema, model, Document } from "mongoose";
import { IUser } from "./users";
import { ILotery } from "./lotery";

export interface ITicket extends Document {
  qrCode: string;
  regDate: Date;
  statusTicket: string;
  loteryPlays: { type: string; num: string; amount: number }[];
  amountTotal: { type: number };
  lotteries: ILotery | string;
  superPaleLotteries?: ILotery | string;
  creatorUser: IUser | string;
  modifierUser?: IUser | string;
}
const ticketSchema: Schema = new Schema(
  {
    qrCode: { type: String, require: true, unique: true },
    regDate: { type: Date, required: true },
    description: { type: String, require: true },
    statusTicket: {
      type: String,
      enum: ["created", "loser", "winner", "canceled"],
      default: "created",
    },
    loteryPlays: [
      {
        type: { type: String, enum: String, num: String, amount: Number },
        require: true,
      },
    ],
    amountTotal: { type: Number, required: true },
    lotteries: { type: Schema.Types.ObjectId, ref: "Lotery", require: true },
    superPaleLotteries: {
      type: Schema.Types.ObjectId,
      ref: "Lotery",
      require: true,
    },
    creatorUser: { type: Schema.Types.ObjectId, ref: "User", require: true },
    modifierUser: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export default model<ITicket>("Ticket", ticketSchema);
