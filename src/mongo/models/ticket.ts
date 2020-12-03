import { Schema, model, Document } from "mongoose";
import { IUser } from "./users";
import { ILotery } from "./lotery";

export interface ITicket extends Document {
  qrCode?: string;
  code?: number;
  regDate?: Date;
  statusTicket?: string;
  loteryPlays: { type: string; num: string; amount: number }[];
  amountTotal: number;
  amountToPaid?: number;
  lotteries: ILotery[] | string[];
  superPaleLotteries?: ILotery[] | string[];
  creatorUser: IUser | string;
  modifierUser?: IUser | string;
}
const ticketSchema: Schema = new Schema(
  {
    qrCode: { type: String, unique: true },
    code: { type: Number, unique: true },
    regDate: { type: Date },
    statusTicket: {
      type: String,
      enum: ["created", "loser", "winner", "canceled", "paid"],
      default: "created",
    },
    loteryPlays: {
      type: [{ type: Object, require: true }],
    },
    amountTotal: { type: Number, required: true },
    amountToPaid: { type: Number },
    lotteries: [{ type: Schema.Types.ObjectId, ref: "Lotery", require: true }],
    superPaleLotteries: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lotery",
        default: [],
      },
    ],
    creatorUser: { type: Schema.Types.ObjectId, ref: "User", require: true },
    modifierUser: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

export default model<ITicket>("Ticket", ticketSchema);
