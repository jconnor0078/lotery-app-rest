import { Schema, model, Document } from "mongoose";
import { IUser } from "./users";

export interface ISquare extends Document {
  regDate: Date;
  pendingAmount: number;
  loseAmount: number;
  loterySalesAmount: number;
  amountToDeliver: number;
  amountDelivered: number;
  user: IUser | string;
  userOfSquare: IUser | string;
}
const squareSchema: Schema = new Schema(
  {
    regDate: { type: Date, require: true },
    pendingAmount: { type: Number, require: true },
    loseAmount: { type: Number, require: true },
    loterySalesAmount: { type: Number, require: true },
    amountToDeliver: { type: Number, require: true },
    amountDelivered: { type: Number, require: true },
    user: { type: Schema.Types.ObjectId, ref: "User", require: true },
    userOfSquare: { type: Schema.Types.ObjectId, ref: "User", require: true },
  },
  {
    timestamps: true,
  }
);

const squareModel = model<ISquare>("Square", squareSchema);

export default squareModel;
