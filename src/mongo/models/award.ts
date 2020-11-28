import { Schema, model, Document } from "mongoose";
import { IUser } from "./users";
import { ILotery } from "./lotery";

export interface IAward extends Document {
  nums: { num1st: string; num2th: string; num3th: string };
  lotery: ILotery | string;
  playDate: Date;
  creatorUser?: IUser | string;
  modifierUser?: IUser | string;
}
const awardSchema: Schema = new Schema(
  {
    nums: {
      type: { num1st: String, num2th: String, num3th: String },
      require: true,
    },
    lotery: { type: Schema.Types.ObjectId, ref: "Lotery", require: true },
    playDate: { type: Date, required: true },
    creatorUser: { type: Schema.Types.ObjectId, ref: "User", require: true },
    modifierUser: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const awardModel = model<IAward>("Award", awardSchema);

export default awardModel;
